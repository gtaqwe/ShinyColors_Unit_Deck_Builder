/**
 * URL의 쿼리를 Object형식으로 취득
 * ?a=a1&b=ab2 -> {a: a1, b: ab2}
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

  // 프로듀스덱 세팅
  produceQuery.forEach((query) => {
    if (query.value === undefined) return;
    if (query.value.indexOf("_") == -1) return;

    // splitedValue의 구성
    // 0:아이돌 번호 (1:마노, 2:히오리, ...)
    // 1:등급과 순번 (ssr1, ssr2, sr1, ..)
    // 2:특훈 (1, 2,...)
    splitedValue = query.value.split("_");
    var idolName = jsonData[splitedValue[0] - 1].idol_en_name.toLowerCase();
    cardAddr = `${idolName}_${query.type}_${splitedValue[1]}`;
    setSelectCard(`#selectedIdolView_${query.offset}`, "icon_normal/", cardAddr);

    // 특훈 쿼리가 없는 경우 무시
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

  // 덱 표시 위치 이동
  if (queryObj.show == "pd") {
    var pdOffset = $("#PRODUCE_DECK_FIELD").offset();
    $("html, body").animate({ scrollTop: pdOffset.top }, 400);
  }
  if (queryObj.show == "fes") {
    var fesOffset = $("#FES_DECK_FIELD").offset();
    $("html, body").animate({ scrollTop: fesOffset.top }, 400);
  }

  // 파라미터에 특훈 표시가 있는 경우의 처리
  if (queryObj.st !== undefined) {
    $("#specialTrainingConvertBtn").prop("checked", true);
    convertSpecialTrainingImg($("#specialTrainingConvertBtn").is(":checked"));
  }

  // 페스덱 세팅
  fesQuery.forEach((query) => {
    if (query.value === undefined) return;
    if (query.value.indexOf("_") == -1) return;

    // splitedValue의 구성
    // 0:아이돌 번호 (1:마노, 2:히오리, ...)
    // 1:등급과 순번 (ssr1, ssr2, sr1, ..)
    // 페스덱은 특훈 쿼리가 없음
    splitedValue = query.value.split("_");
    var idolName = jsonData[splitedValue[0] - 1].idol_en_name.toLowerCase();
    cardAddr = `${idolName}_${query.type}_${splitedValue[1]}`;
    setSelectCard(`#selectedIdolView_${FES_POSITION[query.offset]}`, "icon_fes/", cardAddr);
  });
}
/**
 * 덱 URL을 표시
 * 1. 쿼리 파라미터를 제외한 현재 URL만 취득
 * 2. 프로듀스덱 및 페스덱의 파라미터를 URL에 추가
 * 3. 각 덱의 화면을 표시하도록 화면 이동
 * 4. 특훈 상태 표시 여부를 URL에 추가
 * 5. URL의 마지막에 「&」가 있는 경우 마지막의 「&」를 삭제
 * 6. URL을 표시
 */
function viewDeckUrl(labelId, produceChk = false, fesChk = false) {
  // 1. 쿼리 파라미터를 제외한 현재 URL만 취득
  var url = document.location.href;
  if (url.indexOf("?") != -1) {
    url = url.substring(0, url.indexOf("?"));
  }

  // 2. 프로듀스덱 및 페스덱의 파라미터를 URL에 추가
  url = `${url}?`;
  if (produceChk == true) {
    url += getProduceDeckUrl();
  }
  if (fesChk == true) {
    url += getFesDeckUrl();
  }

  // 3. 각 덱의 화면을 표시하도록 화면 이동
  // 프로듀스덱 URL만 생성시 프로듀스덱을 표시
  // 페스덱 URL만생성시 페스덱을 표시
  if (produceChk == true && fesChk == false) {
    url += "show=pd&";
  } else if (produceChk == false && fesChk == true) {
    url += "show=fes&";
  }

  // 4. 특훈 상태 표시 여부를 URL에 추가
  if ($("#specialTrainingConvertBtn").is(":checked")) {
    url += "st&";
  }

  // 5. URL의 마지막에 「&」가 있는 경우 마지막의 「&」를 삭제
  if (url.slice(-1) == "&") {
    url = url.substr(0, url.length - 1);
  }

  // 6. URL을 표시
  $(labelId).text(url);
}

/**
 * 프로듀스 덱의 URL 취득
 * 1. 편성되어 있는 이미지들의 src로부터 쿼리 파라미터를 조합
 * 2. 특훈 데이터를 취득
 * 3. 일치하는 아이돌명을 확인 후 쿼리를 조합
 */
function getProduceDeckUrl() {
  var queryUrl = "";
  var produceQuery = ["p", "s1", "s2", "s3", "s4", "s5"];
  produceQuery.forEach((pos, offset) => {
    // 1. 편성되어 있는 이미지들의 src로부터 쿼리 파라미터를 조합
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

    // 2. 특훈 데이터를 취득
    var specialTraining = $(`#specialTrainingInput_${offset}`).val();

    // 3. 일치하는 아이돌명을 확인 후 쿼리를 조합
    jsonData.forEach((idol, idx) => {
      if (idol.idol_en_name.toLowerCase() != splitedCardAddr[0]) return;
      queryUrl += `${pos}=${idx + 1}_${splitedCardAddr[2]}_${specialTraining}&`;
    });
  });

  return queryUrl;
}

/**
 * 페스 덱의 URL 취득
 * 1. 편성되어 있는 이미지들의 src로부터 쿼리 파라미터를 조합
 * 2. 일치하는 아이돌명을 확인 후 쿼리를 조합
 */
function getFesDeckUrl() {
  var queryUrl = "";
  var fesQuery = ["le", "vo", "ce", "da", "vi"];
  fesQuery.forEach((pos, offset) => {
    // 1. 편성되어 있는 이미지들의 src로부터 쿼리 파라미터를 조합
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

    // 2. 일치하는 아이돌명을 확인 후 쿼리를 조합
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
function copyToClipboard(containerid) {
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
