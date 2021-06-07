const P_TYPE_LIST = ["P_SSR", "P_SR", "P_R"]
const S_TYPE_LIST = ["S_SSR", "S_SR", "S_R", "S_N"]
const FES_POSITION = ["Leader", "Vocal", "Center", "Dance", "Visual"]
const cardDialogDivId = "#cardDialogDiv"
const idolDialogDivId = "#idolDialogDiv"
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
        var parameter = "'#" + divId + "', '" + idolName + "', " + idolIdx + ", '" + cardType + "', " + offset
        $(idolDialogDivId).append($('<img>',
            {
                id: "idol_" + idolName,
                src: "./img/idol/" + idolName + ".png",
                width: "100px",
                height: "100px",
                class: "dialogImg",
                onclick:"setCardList(" + parameter + ")"
            }))
    }

    $(idolDialogDivId).dialog({
        modal: true,
        title: "아이돌 선택",
        position: { my: "left top", at: "center", of: parentObj },
        width: "600px",
        // buttons: {
        //     "Cancel": function () {
        //         $(this).dialog("close")
        //     }
        // }
    });

    $(".ui-widget-overlay").click (function () {
        $(idolDialogDivId).dialog("close");
    });
}

function setCardList(divId, name, idolIdx, cardType, offset) {
    var selDivId = divId
    $(selDivId).html($('<img>',
        {
            src: "./img/idol/" + name + ".png",
            width: "96px",
            height: "96px"
        }))
    $(idolDialogDivId).dialog("close")

    if (cardType == "P") {
        $("#idolCardBtn_Produce").click(function () { viewCard(this, jsonData[idolIdx], cardType, offset) })
        $("#idolCardBtn_Produce").css('visibility', 'visible')
    }
    else if (cardType == "S") {
        $("#idolCardBtn_Support_" + offset).click(function () { viewCard(this, jsonData[idolIdx], cardType, offset) })
        $("#idolCardBtn_Support_" + offset).css('visibility', 'visible')
    }
    else {
        $("#idolCardBtn_" + FES_POSITION[offset]).click(function () { viewCard(this, jsonData[idolIdx], cardType, offset) })
        $("#idolCardBtn_" + FES_POSITION[offset]).css('visibility', 'visible')
    }
    
}

function viewCard(parentObj, obj, cardType, offset) {
    var type_list
    var divOffset

    if (cardType == "P" || cardType == "F") {
        type_list = P_TYPE_LIST
    }
    else {
        type_list = S_TYPE_LIST
    }

    if (cardType == "P" || cardType == "S") {
        divOffset = offset
    }
    else {
        divOffset = FES_POSITION[offset]
    }

    $(cardDialogDivId).html("")
    for (var typeIdx = 0; typeIdx < type_list.length; typeIdx++) {
        if (obj["card_data"][type_list[typeIdx]] == undefined) {
            continue
        }

        var cardList = obj["card_data"][type_list[typeIdx]]
        var cardLen = obj["card_data"][type_list[typeIdx]].length

        $(cardDialogDivId).append("<h3 style='margin: 10px 0px'>" + type_list[typeIdx].split("_")[1] + "</h3>")
        for (var i = 0; i < cardLen; i++) {
            $(cardDialogDivId).append($('<img>',
                {
                    id: cardList[i]["card_addr"],
                    src: "./img/card/" + cardList[i]["card_addr"] + ".png",
                    width: "auto",
                    height: "auto",
                    class: "dialogImg"
                }))
            $("#" + cardList[i]["card_addr"]).click(function () {
                var selDivId = "#selectedIdolView_" + divOffset
                $(selDivId).html($('<img>',
                    {
                        src: "./img/card/" + this.id + ".png",
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
        title: "카드 선택 (" + obj["idol_name"] + ")",
        position: { my: "left top", at: "center", of: parentObj },
        width: "600px",
        // buttons: {
        //     "Cancel": function () {
        //         $(this).dialog("close");
        //     }
        // }
    });

    $(".ui-widget-overlay").click (function () {
        $(cardDialogDivId).dialog("close");
    });
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
