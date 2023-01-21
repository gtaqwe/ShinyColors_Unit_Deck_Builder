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

  /*********************
   * Produce Deck
   *********************/

  /**
   * Produce Position
   */
  // 아이돌 선택 버튼 처리
  $("#idolCharBtn_Produce").click(function () {
    viewIdolDialog(this, jsonData, "selectedIdolCharViewDiv_Produce", "P", 0);
  });

  // 덱에 설정된 카드 아이콘을 클릭해서 카드 변경
  $(`#selectedIdolView_0`).click(function () {
    let selectedIdolName = $(`#selectedIdolCharViewDiv_Produce`).children("img").attr("name");
    setCardByDeckViewDiv(jsonData, selectedIdolName, `selectedIdolView_0`, "P", 0);
  });

  /**
   * Support Position
   */
  [...Array(5).keys()]
    .map((v) => v + 1)
    .forEach((pos) => {
      // 아이돌 선택 버튼 처리
      $(`#idolCharBtn_Support_${pos}`).click(function () {
        viewIdolDialog(this, jsonData, `selectedIdolCharViewDiv_Support_${pos}`, "S", pos);
      });

      // 덱에 설정된 카드 아이콘을 클릭해서 카드 변경
      $(`#selectedIdolView_${pos}`).click(function () {
        let selectedIdolName = $(`#selectedIdolCharViewDiv_Support_${pos}`)
          .children("img")
          .attr("name");
        setCardByDeckViewDiv(jsonData, selectedIdolName, `selectedIdolView_${pos}`, "S", pos);
      });
    });

  // Ex Skill
  [...Array(6).keys()].forEach((pos) => {
    [...Array(3).keys()]
      .map((v) => v + 1)
      .forEach((exPos) => {
        $(`#selectedIdol_${pos}_ex`).append(
          $("<div>", { id: `selectedIdol_${pos}_ex_${exPos}`, class: "ex_view" })
        );
        $(`#selectedIdol_${pos}_ex_${exPos}`).append(
          $("<img>", { id: `selectedIdol_${pos}_ex_${exPos}_icon`, src: "./img/ex_skill/none.png" })
        );
      });
  });

  // Produce Idol Ex Skill Button Setting
  [...Array(3).keys()]
    .map((v) => v + 1)
    .forEach((exPos) => {
      $(`#produce_ex_${exPos}`).click(function () {
        viewExDialog(this, "P", 0, exPos);
      });

      $(`#selectedIdol_0_ex_${exPos}`).click(function () {
        viewExDialog(this, "P", 0, exPos);
      });
    });

  // Support Idol Ex Skill Button Setting
  [...Array(5).keys()]
    .map((v) => v + 1)
    .forEach((divPos) => {
      [...Array(3).keys()]
        .map((v) => v + 1)
        .forEach((exPos) => {
          $(`#support_${divPos}_ex_${exPos}`).click(function () {
            viewExDialog(this, "S", divPos, exPos);
          });

          $(`#selectedIdol_${divPos}_ex_${exPos}`).click(function () {
            viewExDialog(this, "S", divPos, exPos);
          });
        });
    });

  // EX 스킬 표시 초기화
  convertExSkill($("#exConvertBtn").is(":checked"));

  // 옵션 능력 표시 초기화
  convertOptionAbilityImg($(':radio[name="option_ability"]:checked').val());

  /*********************
   * Fes Deck
   *********************/

  /**
   * Fes Position
   */
  FES_POSITION.forEach((pos, idx) => {
    // 아이돌 선택 버튼 처리
    $(`#idolCharBtn_${pos}`).click(function () {
      viewIdolDialog(this, jsonData, `selectedIdolCharViewDiv_${pos}`, "F", idx);
    });

    // 덱에 설정된 카드 아이콘을 클릭해서 카드 변경
    $(`#selectedIdolView_${pos}`).click(function () {
      let selectedIdolName = $(`#selectedIdolCharViewDiv_${pos}`).children("img").attr("name");
      setCardByDeckViewDiv(jsonData, selectedIdolName, `selectedIdolCharViewDiv_${pos}`, "F", idx);
    });
  });

  // 특훈 초기화
  [...Array(6).keys()].forEach((num) => {
    $(`#specialTrainingInput_${num}`).val(0);
  });

  // 프로듀스덱 리셋버튼 설정
  $("#pDeckReset").click(function () {
    const pDeckCardPosAry = [...Array(6).keys()];
    viewListReset(pDeckCardPosAry.map((v) => `${v}_card`));
    exReset();

    // 특훈 초기화
    pDeckCardPosAry.forEach((pos) => {
      $(`#specialTrainingInput_${pos}`).val(0);
      setSpecialTraining(pos, $(`#specialTrainingInput_${pos}`).val());
    });
    // 특훈 설정 비활성화
    // 현재 설정상태를 변경 후 원래대로 복구
    convertSpecialTrainingImg(!$("#specialTrainingConvertBtn").is(":checked"));
    convertSpecialTrainingImg($("#specialTrainingConvertBtn").is(":checked"));
  });

  // 페스덱 리셋버튼 설정
  $("#fDeckReset").click(function () {
    viewListReset(FES_POSITION.map((v) => `${v}_card`));
    viewListReset(FES_POSITION.map((v) => `${v}_pos`));
  });

  // Query Parameter
  var queryObj = getQuery();
  if (queryObj !== undefined) {
    setQueryImgs(queryObj);
  }

  // 언어 설정
  viewLanguage = getLanguage();

  // 지원하는 언어가 아닌 경우 한국어로 표시
  if (!(viewLanguage in $.lang)) viewLanguage = defalutLanguage;

  // 수동으로 언어 설정시 선택한 언어로 표시
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
  setFesPosIcon();
}

/**
 * 브라우저 언어 설정 Return
 */
function getLanguage() {
  return (navigator.language || navigator.userLanguage).substr(0, 2);
}

/**
 * 각 문자열을 입력 받은 언어에 맞게 매핑해서 설정
 */
function setLanguage(currLang) {
  $("[data-lang]").each(function () {
    // 버튼의 경우 value값을 변경
    if ($(this).attr("type") == "button") {
      $(this).val($.lang[currLang][$(this).data("lang")]);
    } else {
      $(this).html($.lang[currLang][$(this).data("lang")]);
    }
  });
}

/**
 * 지정한 문자열에 매핑되는 문자열을 Return
 */
function getLanguageStringByData(currLang, str) {
  return $.lang[currLang][str];
}

/**
 * 페이지 전체 표시 언어 변경
 */
function changeLanguage() {
  viewLanguage = $("#languageSelect").val();
  setLanguage(viewLanguage);
  var fesChk = $("#fesImgConvertBtn").is(":checked");
  getToggleString(fesChk);
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

//////////////////////////////////////////////////

/**
 * 이미지 캡쳐 다운로드
 */
function captureScreen(frameId, fName, scale) {
  var captureName = `${fName}_Deck_x${scale}_${getTimeString()}.png`;

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

function getTimeString() {
  let d = new Date();
  let year = d.getFullYear();
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  let hour = ("0" + d.getHours()).slice(-2);
  let minute = ("0" + d.getMinutes()).slice(-2);
  let second = ("0" + d.getSeconds()).slice(-2);
  let millisecond = ("00" + d.getMilliseconds()).slice(-3);
  return year + month + day + "_" + hour + minute + second + millisecond;
}
