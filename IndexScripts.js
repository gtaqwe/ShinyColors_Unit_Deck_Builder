const P_TYPE_LIST = ["P_SSR", "P_SR", "P_R"]
const S_TYPE_LIST = ["S_SSR", "S_SR", "S_R", "S_N"]
const FES_POSITION = ["Leader", "Vocal", "Center", "Dance", "Visual"]
const cardDialogDivId = "#cardDialogDiv"
const idolDialogDivId = "#idolDialogDiv"
const spaceSize = 3
var jsonData

// document.body.addEventListener("onload", init());

$().ready(function () {
    init()
});

async function init() {
    await getJSON("json/data.json").then(function (resp) {
        jsonData = JSON.parse(resp)
    });

    // Produce Deck
    $("#idolCharBtn_Produce").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Produce", "P", 0) })
    $("#idolCharBtn_Support_1").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Support_1", "S", 1) })
    $("#idolCharBtn_Support_2").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Support_2", "S", 2) })
    $("#idolCharBtn_Support_3").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Support_3", "S", 3) })
    $("#idolCharBtn_Support_4").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Support_4", "S", 4) })
    $("#idolCharBtn_Support_5").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Support_5", "S", 5) })

    // Fes Deck
    $("#idolCharBtn_Leader").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Leader", "F", 0) })
    $("#idolCharBtn_Vocal").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Vocal", "F", 1) })
    $("#idolCharBtn_Center").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Center", "F", 2) })
    $("#idolCharBtn_Dance").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Dance", "F", 3) })
    $("#idolCharBtn_Visual").click(function () { viewIdol(this, jsonData, "selectedIdolCharViewDiv_Visual", "F", 4) })

    var fesChk = $('#fesImgConvertBtn').is(':checked')
    convertFesImg(fesChk)

    var pDeckSpaceVal = $(':radio[name="p_deck_space"]:checked').val()
    var fDeckSpaceVal = $(':radio[name="f_deck_space"]:checked').val()

    setDeckSpace("P", pDeckSpaceVal)
    setDeckSpace("F", fDeckSpaceVal)
}

function getJSON(jsonFile) {
    try {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', jsonFile, true);
            request.onload = function () {
                if (request.status == 200) {
                    resolve(request.responseText);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function () {
                reject(Error('Error fetching data.'));
            };
            request.send();
        });
    } catch (err) {
        console.error(err);
    }
}

function viewIdol(parentObj, obj, divId, cardType, offset) {    
    $(idolDialogDivId).html("")
    for (var idolIdx = 0; idolIdx < obj.length; idolIdx++) {
        var idolName = obj[idolIdx]["eng_name"]
        var idolInsight = obj[idolIdx]["insight"]

        var parameter = "'#" + divId + "', '" + idolName + "', '" + idolInsight + "', " + idolIdx + ", '" + cardType + "', " + offset     
            
        $(idolDialogDivId).append($('<div>',
            {
                id: "idolDiv_" + idolName,
                style: "display:inline-flex;position: relative;",
                onclick:"setCardList(" + parameter + ")"
            }))

        $("#idolDiv_" + idolName).append($('<img>', {
            id: "idol_" + idolName,
            src: "./img/idol/" + idolName + ".png",
            width: "100px",
            height: "100px",
            class: "dialogImg",
        }))

        var insightChk = $('#insightConvertBtn').is(':checked')
        if (cardType == "S" && insightChk == true) $("#idolDiv_" + idolName).append($('<img>', pasteInsightImg(idolInsight)))
    }
    
    $(idolDialogDivId).dialog({
        modal: true,
        title: "아이돌 선택",
        position: { my: "left top", at: "center", of: parentObj, collision: "fit" },
        width: "600px",
    });

    $(".ui-widget-overlay").click (function () {
        $(idolDialogDivId).dialog("close");
    });
}

function pasteIdolImg(name, insight) {
    return {
        name: name,
        insight: insight,
        src: "./img/idol/" + name + ".png",
        width: "96px",
        height: "96px"
    }
}

function pasteInsightImg(insight) {
    return {
        src: "./img/assets/" + insight + "_Insight.png",
        style: "position: absolute; width: 35px; height: 35px; bottom: 0px; right: 0px;"
    }
}

function setCardList(divId, name, insight, idolIdx, cardType, offset) {
    var selDivId = divId
    $(selDivId).html($('<img>', pasteIdolImg(name, insight)))
    $(idolDialogDivId).dialog("close")

    if (cardType == "P") {
        $("#idolCardBtn_Produce").click(function () { viewCardDialog(this, jsonData[idolIdx], cardType, offset) })
        $("#idolCardBtn_Produce").css('visibility', 'visible')
    }
    else if (cardType == "S") {
        $("#idolCardBtn_Support_" + offset).click(function () { viewCardDialog(this, jsonData[idolIdx], cardType, offset) })
        $("#idolCardBtn_Support_" + offset).css('visibility', 'visible')

        var insightChk = $('#insightConvertBtn').is(':checked')
        if(insightChk == true) $('#selectedIdolCharViewDiv_Support_' + offset).append($('<img>', pasteInsightImg(insight)))
    }
    else {
        $("#idolCardBtn_" + FES_POSITION[offset]).click(function () { viewCardDialog(this, jsonData[idolIdx], cardType, offset) })
        $("#idolCardBtn_" + FES_POSITION[offset]).css('visibility', 'visible')
    }    
}

function viewCardDialog(parentObj, obj, cardType, offset) {
    var type_list
    var divOffset
    var imgPath

    if (cardType == "P" || cardType == "F") {
        type_list = P_TYPE_LIST
    }
    else {
        type_list = S_TYPE_LIST
    }

    if (cardType == "P" || cardType == "S") {
        divOffset = offset
        imgPath = "card/"
    }
    else {        
        divOffset = FES_POSITION[offset]
        var fesChk = $('#fesImgConvertBtn').is(':checked')
        if (fesChk == true) imgPath = "card_fes/"
        else imgPath = "card/"
        
    }

    $(cardDialogDivId).html("")
    for (var typeIdx = 0; typeIdx < type_list.length; typeIdx++) {
        if (obj["card_data"][type_list[typeIdx]] == undefined) continue

        var cardList = obj["card_data"][type_list[typeIdx]]
        var cardLen = obj["card_data"][type_list[typeIdx]].length

        $(cardDialogDivId).append("<h3 style='margin: 10px 0px'>" + type_list[typeIdx].split("_")[1] + "</h3>")
        for (var i = 0; i < cardLen; i++) {
            $(cardDialogDivId).append($('<img>',
                {
                    id: cardList[i]["card_addr"],
                    src: "./img/" + imgPath + cardList[i]["card_addr"] + ".png",
                    width: "auto",
                    height: "auto",
                    class: "dialogImg"
                }))
            $("#" + cardList[i]["card_addr"]).click(function () {
                var selDivId = "#selectedIdolView_" + divOffset
                $(selDivId).html($('<img>',
                    {
                        src: "./img/" + imgPath  + this.id + ".png",
                        width: "96px",
                        height: "96px"
                    }))
                $(cardDialogDivId).dialog("close")
            })
        }

        if (typeIdx + 1 < type_list.length) {$(cardDialogDivId).append("<hr>")}
    }

    $(cardDialogDivId).dialog({
        modal: true,
        title: "카드 선택",        
        position: { my: "left top", at: "center", of: parentObj, collision: "fit" },
        width: 600
    });

    $(".ui-widget-overlay").click (function () {
        $(cardDialogDivId).dialog("close");
    });
}

function convertFesImg(fesChk) {
    getToggleString(fesChk)
    convertFesDeckImg(fesChk)
}

function getToggleString(fesChk) {
    if (fesChk == true) {
        $("#toggleStr").html("페스");
    }
    else {
        $("#toggleStr").html("사복");
    }
}

function convertFesDeckImg(fesChk) {
    for (var i = 0; i < FES_POSITION.length; i++) {
        var imgUrl = $('#selectedIdolView_' + FES_POSITION[i]).children('img').attr("src")
        if (imgUrl != undefined) {
            if (fesChk == true) {
                imgUrl = imgUrl.replace("card/", "card_fes/")
            }
            else {
                imgUrl = imgUrl.replace("card_fes/", "card/")
            }
            $('#selectedIdolView_' + FES_POSITION[i]).children('img').attr("src", imgUrl)
        }
    }
}

function convertInsightImg(insightChk) {
    for (var i = 0, offset =1 ; i < 5; i++, offset++) {
        var imgCode = $('#selectedIdolCharViewDiv_Support_' + offset).children('img')

        if (imgCode.length > 0) {
            var idolName = imgCode.attr("name")
            var insight = imgCode.attr("insight")

            $('#selectedIdolCharViewDiv_Support_' + offset).html('')
            if (insightChk == true) {
                $('#selectedIdolCharViewDiv_Support_' + offset).append($('<img>', pasteIdolImg(idolName, insight)))
                $('#selectedIdolCharViewDiv_Support_' + offset).append($('<img>', pasteInsightImg(insight)))
            }
            else {
                $('#selectedIdolCharViewDiv_Support_' + offset).append($('<img>', pasteIdolImg(idolName, insight)))
            }
        }
    }
}

function setDeckSpace(deckType, spaceType) {
    var spaceAry

    if (deckType == "P"){
        if (spaceType == "1") spaceAry = [0,0,0,0,0]
        else if (spaceType == "2") spaceAry = [1,1,1,1,1]
        else spaceAry = [1,0,0,0,0]

        for (var i = 0; i < spaceAry.length; i++) {
            $("#p_space_div_" + (i + 1)).css("margin","0px " + (spaceAry[i] * spaceSize) + "px")
        }
    }
    else {
        if (spaceType == "1") spaceAry = [0,0,0,0]
        else spaceAry = [1,1,1,1]


        for (var i = 0; i < spaceAry.length; i++) {
            $("#f_space_div_" + (i + 1)).css("margin","0px " + (spaceAry[i] * spaceSize) + "px")
        }
    }
}

//////////////////////////////////////////////////

function captureScreen(frameId, fName) {
    var captureName = fName + "_Deck.png";

    html2canvas(document.querySelector("#" + frameId), { scrollY: -window.scrollY, scrollX: -window.scrollX }).then(canvas => {
        downloadURI(canvas.toDataURL('image/png'), captureName);
    });
}

function downloadURI(uri, filename) {
    var link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    link.click();
}
