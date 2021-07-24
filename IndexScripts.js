const P_TYPE_LIST = ["P_SSR", "P_SR", "P_R"];
const S_TYPE_LIST = ["S_SSR", "S_SR", "S_R", "S_N"];
const FES_POSITION = ["Leader", "Vocal", "Center", "Dance", "Visual"];
const cardDialogDivId = "#cardDialogDiv";
const idolDialogDivId = "#idolDialogDiv";
const spaceSize = 3;
var jsonData;
var viewLanguage;

$().ready(function () {
  init();
});

async function init() {
  // Read JSON
  await getJSON("json/data.json").then(function (resp) {
    jsonData = JSON.parse(resp);
  });

  // Produce Deck
  // Produce Position
  $("#idolCharBtn_Produce").click(function () {
    viewIdolDialog(this, jsonData, "selectedIdolCharViewDiv_Produce", "P", 0);
  });

  // Support Position
  [...Array(5).keys()]
    .map((v) => v + 1)
    .forEach((pos) => {
      $(`#idolCharBtn_Support_${pos}`).click(function () {
        viewIdolDialog(this, jsonData, `selectedIdolCharViewDiv_Support_${pos}`, "S", pos);
      });
    });

  // Fes Deck
  FES_POSITION.forEach((pos, idx) => {
    $(`#idolCharBtn_${pos}`).click(function () {
      viewIdolDialog(this, jsonData, `selectedIdolCharViewDiv_${pos}`, "F", idx);
    });
  });

  [...Array(6).keys()].forEach((num) => {
    $(`#specialTrainingInput_${num}`).val(0);
  });

  // Query Parameter
  var queryObj = getQuery();
  if (queryObj !== undefined) {
    setQueryImgs(queryObj);
  }

  // 언어 설정
  viewLanguage = getLanguage();
  if (queryObj !== undefined && queryObj.lang !== undefined && queryObj.lang !== "") {
    if (queryObj.lang in $.lang) {
      viewLanguage = queryObj.lang;
      $("#languageSetting").css("display", "inline");
    }
  }
  setLanguage(viewLanguage);
  $("#languageSelect").val(viewLanguage).prop("selected", true);

  // 기타 옵션 초기화 설정
  convertSpecialTrainingImg($("#specialTrainingConvertBtn").is(":checked"));

  var pDeckSpaceVal = $(':radio[name="p_deck_space"]:checked').val();
  var fDeckSpaceVal = $(':radio[name="f_deck_space"]:checked').val();

  setDeckSpace("P", pDeckSpaceVal);
  setDeckSpace("F", fDeckSpaceVal);

  convertFesImg($("#fesImgConvertBtn").is(":checked"));
}

/**
 * URL의 쿼리를 Object형식으로 취득
 * ~~/?a=a1&b=ab2 -> {a: a1, b: ab2}
 */
function getQuery() {
  var url = document.location.href;
  if (url.indexOf("?") == -1) return;

  var qs = url.substring(url.indexOf("?") + 1).split("&");
  for (var i = 0, result = {}; i < qs.length; i++) {
    qs[i] = qs[i].split("=");
    result[qs[i][0]] = decodeURIComponent(qs[i][1]);
  }
  return result;
}

/**
 * 쿼리로 받은 덱 데이터를 표시
 */
function setQueryImgs(queryObj) {
  // 프로듀스 덱 쿼리
  var produceQuery = [
    { value: queryObj.p, type: "p", offset: 0 },
    { value: queryObj.s1, type: "s", offset: 1 },
    { value: queryObj.s2, type: "s", offset: 2 },
    { value: queryObj.s3, type: "s", offset: 3 },
    { value: queryObj.s4, type: "s", offset: 4 },
    { value: queryObj.s5, type: "s", offset: 5 },
  ];

  // 페스 덱 쿼리
  var fesQuery = [
    { value: queryObj.le, type: "p", offset: 0 },
    { value: queryObj.vo, type: "p", offset: 1 },
    { value: queryObj.ce, type: "p", offset: 2 },
    { value: queryObj.da, type: "p", offset: 3 },
    { value: queryObj.vi, type: "p", offset: 4 },
  ];

  produceQuery.forEach((query) => {
    if (query.value === undefined) return;
    if (query.value.indexOf("_") == -1) return;

    splitedValue = query.value.split("_");
    var idolName = jsonData[splitedValue[0] - 1].idol_en_name.toLowerCase();
    cardAddr = `${idolName}_${query.type}_${splitedValue[1]}`;
    setSelectCard(`#selectedIdolView_${query.offset}`, "card/", cardAddr);

    if (splitedValue.length >= 3) {
      // 특훈 쿼리가 숫자가 아닐 경우 0으로 세팅
      // aaa -> 0
      var stNum = isNaN(splitedValue[2]) ? 0 : splitedValue[2];

      // 특훈 쿼리가 0보다 작을 경우 0으로 세팅
      // -1 -> 0
      stNum = stNum < 0 ? 0 : stNum;

      // 특훈 쿼리가 4보다 클 경우 4로 세팅
      // 10 -> 4
      stNum = stNum > 4 ? 4 : stNum;
      $(`#specialTrainingInput_${query.offset}`).val(stNum);
      setSpecialTraining(query.offset, stNum);
    }
  });

  fesQuery.forEach((query) => {
    if (query.value === undefined) return;
    if (query.value.indexOf("_") == -1) return;

    splitedValue = query.value.split("_");
    var idolName = jsonData[splitedValue[0] - 1].idol_en_name.toLowerCase();
    cardAddr = `${idolName}_${query.type}_${splitedValue[1]}`;
    setSelectCard(`#selectedIdolView_${FES_POSITION[query.offset]}`, "card_fes/", cardAddr);
  });
}

/**
 * 브라우저 언어 설정 Return
 */
function getLanguage() {
  return (navigator.language || navigator.userLanguage).substr(0, 2);
}

function setLanguage(currLang) {
  $("[data-lang]").each(function () {
    if ($(this).attr("type") == "button") {
      $(this).val($.lang[currLang][$(this).data("lang")]);
    } else {
      $(this).html($.lang[currLang][$(this).data("lang")]);
    }
  });
}

function setLanguageById(currLang, id, str) {
  $(id).html($.lang[currLang][str]);
}

function getLanguageStringByData(currLang, str) {
  return $.lang[currLang][str];
}

function changeLanguage() {
  viewLanguage = $("#languageSelect").val();
  setLanguage(viewLanguage);
  var fesChk = $("#fesImgConvertBtn").is(":checked");
  getToggleString(fesChk);
}

/**
 * 덱 URL 표시
 */
function viewDeckUrl(labelId, produceChk = false, fesChk = false) {
  var url = document.location.href;
  if (url.indexOf("?") != -1) {
    url = url.substring(0, url.indexOf("?"));
  }
  url = `${url}?`;
  if (produceChk == true) {
    url += getProduceDeckUrl();
  }
  if (fesChk == true) {
    url += getFesDeckUrl();
  }

  // URL의 마지막에 있는「&」삭제
  if (url.slice(-1) == "&") {
    url = url.substr(0, url.length - 1);
  }

  $(labelId).text(url);
}

/**
 * 프로듀스 덱의 URL 취득
 */
function getProduceDeckUrl() {
  var queryUrl = "";
  var produceQuery = ["p", "s1", "s2", "s3", "s4", "s5"];
  produceQuery.forEach((pos, offset) => {
    var cardPath = $(`#selectedIdolView_${offset}`)
      // 이미지 주소 취득
      .children("img")
      .attr("src");
    if (cardPath === undefined) return;
    // 「/」로 나눈 수 가장 마지막 파일명만 취득
    var splitedCardAddr = cardPath
      .split("/")
      .slice(-1)[0]
      // 확장자를 제외한 파일명 취득
      .split(".")[0]
      // 파일명 분리
      .split("_");

    var specialTraining = $(`#specialTrainingInput_${offset}`).val();

    jsonData.forEach((idol, idx) => {
      if (idol.idol_en_name.toLowerCase() != splitedCardAddr[0]) return;
      queryUrl += `${pos}=${idx + 1}_${splitedCardAddr[2]}_${specialTraining}&`;
    });
  });

  return queryUrl;
}

/**
 * 페스 덱의 URL 취득
 */
function getFesDeckUrl() {
  var queryUrl = "";
  var fesQuery = ["le", "vo", "ce", "da", "vi"];
  fesQuery.forEach((pos, offset) => {
    var cardPath = $(`#selectedIdolView_${FES_POSITION[offset]}`)
      // 이미지 주소 취득
      .children("img")
      .attr("src");
    if (cardPath === undefined) return;
    // 「/」로 나눈 수 가장 마지막 파일명만 취득
    var splitedCardAddr = cardPath
      .split("/")
      .slice(-1)[0]
      // 확장자를 제외한 파일명 취득
      .split(".")[0]
      // 파일명 분리
      .split("_");

    jsonData.forEach((idol, idx) => {
      if (idol.idol_en_name.toLowerCase() != splitedCardAddr[0]) return;
      queryUrl += `${pos}=${idx + 1}_${splitedCardAddr[2]}&`;
    });
  });
  return queryUrl;
}

/**
 * Div의 텍스트를 클립보드에 복사
 */
function CopyToClipboard(containerid) {
  // Create a new textarea element and give it id='temp_element'
  const textarea = document.createElement("textarea");
  textarea.id = "temp_element";
  // Optional step to make less noise on the page, if any!
  textarea.style.height = 0;
  // Now append it to your page somewhere, I chose <body>
  document.body.appendChild(textarea);
  // Give our textarea a value of whatever inside the div of id=containerid
  textarea.value = document.getElementById(containerid).innerText;
  // Now copy whatever inside the textarea to clipboard
  const selector = document.querySelector("#temp_element");
  selector.select();
  document.execCommand("copy");
  // Remove the textarea
  document.body.removeChild(textarea);
}

/**
 * JSON 데이터 취득
 */
function getJSON(jsonFile) {
  try {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open("GET", jsonFile, true);
      request.onload = function () {
        if (request.status == 200) {
          resolve(request.responseText);
        } else {
          reject(Error(request.statusText));
        }
      };

      request.onerror = function () {
        reject(Error("Error fetching data."));
      };
      request.send();
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * 아이돌 선택 버튼 클릭시, 각 아이돌의 이미지를 보여주는 다이얼로그 표시
 * 히라메키 표시가 체크 된 경우, 서포터 아이돌 목록에 히라메키 아이콘도 표시
 */
function viewIdolDialog(parentObj, obj, divId, cardType, offset) {
  $(idolDialogDivId).html("");
  for (var idolIdx = 0; idolIdx < obj.length; idolIdx++) {
    // 파일명이 모두 소문자 영문이기 때문에 영문명을 모두 소문자로
    // Mano -> mano
    var idolNameSrc = obj[idolIdx]["idol_en_name"].toLowerCase();
    var idolInsight = obj[idolIdx]["insight"];

    var parameter = `'#${divId}', '${idolNameSrc}', '${idolInsight}', ${idolIdx}, '${cardType}', ${offset}`;

    // 아이돌 목록 다이얼로그 표시
    // 아이돌 선택시, 해당 아이돌의 카드 목록 전개하도록 세팅
    $(idolDialogDivId).append(
      $("<div>", {
        id: `idolDiv_${idolNameSrc}`,
        style: "display:inline-flex;position: relative;",
        onclick: `viewCard(${parameter})`,
      })
    );

    // 아이돌 이미지 세팅
    $(`#idolDiv_${idolNameSrc}`).append(
      $("<img>", {
        id: `idol_${idolNameSrc}`,
        src: `./img/idol/${idolNameSrc}.png`,
        width: "100px",
        height: "100px",
        class: "dialogImg",
      })
    );

    // 히라메키 표시가 체크되어있는 경우
    // 서포터 아이돌 목록에 히라메키 아이콘을 표시
    var insightChk = $("#insightConvertBtn").is(":checked");
    if (cardType == "S" && insightChk == true)
      $(`#idolDiv_${idolNameSrc}`).append($("<img>", getInsightImg(idolInsight)));
  }

  var dialogTitle = getLanguageStringByData(viewLanguage, "selectIdol");
  // 다이얼로그 세팅
  $(idolDialogDivId).dialog({
    modal: true,
    title: dialogTitle,
    position: { my: "left top", at: "center", of: parentObj, collision: "fit" },
    width: "600px",
  });

  $(".ui-widget-overlay").click(function () {
    $(idolDialogDivId).dialog("close");
  });
}

/**
 * 표시할 아이돌의 이미지와 히라메키 정보 Return
 */
function getIdolImg(name, insight) {
  return {
    name: name,
    insight: insight,
    src: `./img/idol/${name}.png`,
    width: "96px",
    height: "96px",
  };
}

/**
 * 히라메키 이미지 Return
 */
function getInsightImg(insight) {
  return {
    src: `./img/assets/${insight}_Insight.png`,
    style: "position: absolute; width: 35px; height: 35px; bottom: 0px; right: 0px;",
  };
}

/**
 * 아이돌 선택시 해당 아이돌의 카드를 표시하도록 세팅 후
 * 선택 할 수 있도록 카드 다이얼로그를 전개
 */
function viewCard(divId, name, insight, idolIdx, cardType, offset) {
  // 1. 아이돌 이미지 세팅
  setIdolImg(divId, name, insight);

  // 2. 선택한 아이돌의 카드를 세팅
  setCardList(insight, idolIdx, cardType, offset);

  // 3. 세팅 후 자동으로 카드 선택 버튼을 클릭
  if (cardType == "P") {
    $(`#idolCardBtn_Produce`).click();
  } else if (cardType == "S") {
    $(`#idolCardBtn_Support_${offset}`).click();
  } else {
    $(`#idolCardBtn_${FES_POSITION[offset]}`).click();
  }
}

/**
 * 지정한 위치에 아이돌 이미지와 히라메키 이미지를 세팅
 */
function setIdolImg(divId, name, insight) {
  $(divId).html($("<img>", getIdolImg(name, insight)));
}

/**
 * 아이돌 선택시 카드 선택 버튼의 동작을 세팅
 * 카드 종류는 (프로듀스, 서포트, 페스) 3종류로 처리
 *
 * 1. 각 카드 선택 버튼마다 선택한 아이돌 카드를 세팅 후
 * 2. 숨겨놓았던 카드 선택 버튼을 표시
 * 3. 히라메키 표시 설정에 따라 선택한 서포터 아이돌 칸(다이얼로그가 아님)에 히라메키 아이콘을 표시
 */
function setCardList(insight, idolIdx, cardType, offset) {
  $(idolDialogDivId).dialog("close");

  // 프로듀스 카드의 경우
  if (cardType == "P") {
    $("#idolCardBtn_Produce").click(function () {
      viewCardDialog(this, jsonData[idolIdx], cardType, offset);
    });
    $("#idolCardBtn_Produce").css("visibility", "visible");
  }
  // 서포터 카드의 경우
  else if (cardType == "S") {
    $(`#idolCardBtn_Support_${offset}`).click(function () {
      viewCardDialog(this, jsonData[idolIdx], cardType, offset);
    });
    $(`#idolCardBtn_Support_${offset}`).css("visibility", "visible");

    var insightChk = $("#insightConvertBtn").is(":checked");
    if (insightChk == true) {
      $(`#selectedIdolCharViewDiv_Support_${offset}`).append($("<img>", getInsightImg(insight)));
    }
  }
  // 페스 카드의 경우
  else {
    $(`#idolCardBtn_${FES_POSITION[offset]}`).click(function () {
      viewCardDialog(this, jsonData[idolIdx], cardType, offset);
    });
    $(`#idolCardBtn_${FES_POSITION[offset]}`).css("visibility", "visible");
  }
}

/**
 * 카드 선택 버튼 클릭시 각 아이돌의 카드 이미지를 보여주는 다이얼로그를 표시
 */
function viewCardDialog(parentObj, obj, cardType, offset) {
  var type_list;
  var divOffset;
  var imgPath;

  // 1. 카드가 프로듀스(P), 서포트(S), 페스(F) 카드 종류에 따라 표시하는 카드의 등급을 확인
  // P, F : P_SSR, P_SR, P_R : 3종류
  // S : S_SSR, S_SR, S_R, S_N : 4종류
  if (cardType == "P" || cardType == "F") {
    type_list = P_TYPE_LIST;
  } else {
    type_list = S_TYPE_LIST;
  }

  // 2. 카드의 위치(포지션)와 이미지 경로를 설정 (페스 카드의 경우, 사복과 페스 설정에 따라 경로 설정)
  // 사복 (P, S) : "card/"
  // 페스 (P) : "card_fes/"
  if (cardType == "P" || cardType == "S") {
    divOffset = offset;
    imgPath = "card/";
  } else {
    divOffset = FES_POSITION[offset];
    var fesChk = $("#fesImgConvertBtn").is(":checked");
    if (fesChk == true) imgPath = "card_fes/";
    else imgPath = "card/";
  }

  // 3. 카드 목록 다이얼로그 표시
  $(cardDialogDivId).html("");
  for (var typeIdx = 0; typeIdx < type_list.length; typeIdx++) {
    if (obj["card_data"][type_list[typeIdx]] == undefined) continue;

    var cardList = obj["card_data"][type_list[typeIdx]];

    $(cardDialogDivId).append(
      `<h3 style='margin: 10px 0px'>${type_list[typeIdx].split("_")[1]}</h3>`
    );

    cardList.forEach((card) => {
      // 카드 목록의 이미지 설정
      // 카드 이미지가 없는 경우 「Blank_Idol.png」을 표시
      $(cardDialogDivId).append(
        $("<img>", {
          id: card.card_addr,
          src: `./img/${imgPath}${card.card_addr}.png`,
          width: "96px",
          height: "96px",
          class: "dialogImg",
          onerror: "this.src='./img/assets/Blank_Idol.png'",
        })
      );

      // 카드 선택시 덱에 입력
      $(`#${card.card_addr}`).click(function () {
        var selDivId = `#selectedIdolView_${divOffset}`;
        setSelectCard(selDivId, imgPath, this.id);
        $(cardDialogDivId).dialog("close");
      });
    });

    // 각 등급별 구분 라인 추가
    if (typeIdx + 1 < type_list.length) {
      $(cardDialogDivId).append("<hr>");
    }
  }

  var dialogTitle = getLanguageStringByData(viewLanguage, "selectCard");

  // 다이얼로그 세팅
  $(cardDialogDivId).dialog({
    modal: true,
    title: dialogTitle,
    position: { my: "left top", at: "center", of: parentObj, collision: "fit" },
    width: 600,
  });

  $(".ui-widget-overlay").click(function () {
    $(cardDialogDivId).dialog("close");
  });
}

/**
 * 카드 선택시 해당되는 위치에 카드 이미지 설정
 */
function setSelectCard(divId, imgPath, cardAddr) {
  $(divId).html(
    $("<img>", {
      id: `${divId.replace("#", "")}_card`,
      src: `./img/${imgPath}${cardAddr}.png`,
      width: "96px",
      height: "96px",
      onerror: "this.src='./img/assets/Blank_Idol.png'",
    })
  );

  // 카드의 특훈 설정이 가능하도록 설정 및 설정되어 있는 특훈을 적용
  var offset = divId.split("_")[1];
  if (offset in [...Array(6).keys()].map((v) => `${v}`)) {
    setSpecialTraining(offset, $(`#specialTrainingInput_${offset}`).val());
    if ($("#specialTrainingConvertBtn").is(":checked") == true) {
      $(`#specialTrainingInput_${offset}`).prop("disabled", false);
    }
    convertSpecialTrainingImg($("#specialTrainingConvertBtn").is(":checked"));
  }
}

function convertSpecialTrainingImg(stChk) {
  [...Array(6).keys()].forEach((num) => {
    // 특훈 표시
    if (stChk == true) {
      $(`#selectedIdolView_${num}`).attr("class", "idol_view_st");
      if ($(`#selectedIdolView_${num}_card`).length > 0) {
        $(`#specialTrainingInput_${num}`).prop("disabled", false);
      }
      $(".specialTrainingStar").css("visibility", "visible");
    }
    // 특훈 비표시
    else {
      $(`#selectedIdolView_${num}`).attr("class", "idol_view");
      $(`#specialTrainingInput_${num}`).prop("disabled", true);
      $(".specialTrainingStar").css("visibility", "hidden");
    }
  });
}

function setSpecialTraining(pos, starNum) {
  var divId = `#selectedIdolView_${pos}`;
  var starPos = {
    1: { bottom: 22, right: 85 },
    2: { bottom: 37, right: 85 },
    3: { bottom: 53, right: 85 },
    4: { bottom: 70, right: 84 },
  };

  $(`#specialTrainingStar_${pos}`).remove();
  if ($(`${divId}_card`).length == 0) {
    $(`#specialTrainingInput_${pos}`).val(0);
    return;
  }

  // 0 <= starNum <= 4 가 되도록 조정
  var setStarNum = starNum;
  setStarNum = setStarNum > 4 ? 4 : setStarNum;
  setStarNum = setStarNum < 0 ? 0 : setStarNum;

  $(`#specialTrainingInput_${pos}`).val(setStarNum);

  if (setStarNum > 0) {
    $(divId).append(
      $("<img>", {
        id: `specialTrainingStar_${pos}`,
        src: `./img/assets/star${setStarNum}.png`,
        class: "specialTrainingStar",
      })
        .css("position", "relative")
        .css("bottom", `${starPos[setStarNum].bottom}px`)
        .css("right", `${starPos[setStarNum].right}px`)
    );
  }
}

function setSpecialTrainingCount(pos, num) {
  if ($(`#specialTrainingInput_${pos}`).is(":disabled") != true) {
    var newVal = Number($(`#specialTrainingInput_${pos}`).val()) + num;
    $(`#specialTrainingInput_${pos}`).val(newVal);
    setSpecialTraining(pos, newVal);
  }
}

/**
 * 페스덱의 페스이미지와 사복 이미지의 설정
 */
function convertFesImg(fesChk) {
  getToggleString(fesChk);
  convertFesDeckImg(fesChk);
}

/**
 * 페스와 사복 토글의 텍스트 표시
 */
function getToggleString(fesChk) {
  var str;
  if (fesChk == true) {
    str = "fes";
    // $("#toggleStr").html("페스");
  } else {
    str = "casual";
    // $("#toggleStr").html("사복");
  }
  setLanguageById(viewLanguage, "#toggleStr", str);
}

/**
 * 페스와 사복 아이콘 표시 설정에 따라 이미지를 변경
 */
function convertFesDeckImg(fesChk) {
  FES_POSITION.forEach((pos) => {
    var imgUrl = $(`#selectedIdolView_${pos}`).children("img").attr("src");
    if (imgUrl != undefined) {
      if (fesChk == true) {
        imgUrl = imgUrl.replace("card/", "card_fes/");
      } else {
        imgUrl = imgUrl.replace("card_fes/", "card/");
      }
      $(`#selectedIdolView_${pos}`).children("img").attr("src", imgUrl);
    }
  });
}

/**
 * 서포터 아이돌 이미지에 히라메키 아이콘 표시 설정
 */
function convertInsightImg(insightChk) {
  for (var offset = 1; offset <= 5; offset++) {
    var imgCode = $(`#selectedIdolCharViewDiv_Support_${offset}`).children("img");

    if (imgCode.length > 0) {
      var idolNameSrc = imgCode.attr("name");
      var insight = imgCode.attr("insight");

      $(`#selectedIdolCharViewDiv_Support_${offset}`).html("");
      if (insightChk == true) {
        $(`#selectedIdolCharViewDiv_Support_${offset}`).append(
          $("<img>", getIdolImg(idolNameSrc, insight))
        );
        $(`#selectedIdolCharViewDiv_Support_${offset}`).append($("<img>", getInsightImg(insight)));
      } else {
        $(`#selectedIdolCharViewDiv_Support_${offset}`).append(
          $("<img>", getIdolImg(idolNameSrc, insight))
        );
      }
    }
  }
}

/**
 * 덱 이미지 표시 간격 설정
 */
function setDeckSpace(deckType, spaceType) {
  var spaceAry;

  if (deckType == "P") {
    if (spaceType == "1") spaceAry = [0, 0, 0, 0, 0];
    else if (spaceType == "2") spaceAry = [1, 1, 1, 1, 1];
    else spaceAry = [1, 0, 0, 0, 0];

    spaceAry.forEach((space, i) => {
      $(`#p_space_div_${i + 1}`).css("margin", `0px ${space * spaceSize}px`);
    });
  } else {
    if (spaceType == "1") spaceAry = [0, 0, 0, 0];
    else spaceAry = [1, 1, 1, 1];

    spaceAry.forEach((space, i) => {
      $(`#f_space_div_${i + 1}`).css("margin", `0px ${space * spaceSize}px`);
    });
  }
}

//////////////////////////////////////////////////

/**
 * 이미지 캡쳐 다운로드
 */
function captureScreen(frameId, fName, scale) {
  var captureName = `${fName}_Deck_x${scale}.png`;

  // 이미지 배율 설정
  imgScale = window.devicePixelRatio * scale;

  html2canvas(document.querySelector(`#${frameId}`), {
    scrollY: -window.scrollY,
    scrollX: -window.scrollX,
    scale: imgScale,
  }).then((canvas) => {
    downloadURI(canvas.toDataURL("image/png"), captureName);
  });
}

function downloadURI(uri, filename) {
  var link = document.createElement("a");
  link.download = filename;
  link.href = uri;
  link.click();
}
