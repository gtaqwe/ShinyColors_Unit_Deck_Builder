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
function getInsightImg(insight, type) {
  if (type == 1) {
    return {
      src: `./img/assets/${insight}_Insight_${type}.png`,
      style: "position: absolute; width: 35px; height: 35px; bottom: 0px; right: 0px;",
    };
  } else if (type == 2) {
    return {
      src: `./img/assets/${insight}_Insight_${type}.png`,
      style: "width: 96px; height: 35px; bottom: 0px; right: 0px;",
    };
  }
}

/**
 * 아이디어 이미지 Return
 */
function getIdeaImg(idea) {
  return {
    src: `./img/assets/${idea}_Idea.png`,
    style: "width: 96px; height: 35px; bottom: 0px; right: 0px;",
  };
}

/**
 * 악곡숙련도 이미지 Return
 */
function getProficiencyImg(prof) {
  return {
    src: `./img/assets/${prof}_Prof.png`,
    style: "width: 96px; height: 35px; bottom: 0px; right: 0px;",
  };
}

/**
 * 옵션 능력의 Object를 Return
 */
function getOptionAbility(idea, insight, proficiency) {
  return {
    idea: idea,
    insight: insight,
    proficiency: proficiency,
  };
}

/**
 * 특훈 표시 변경
 */
function convertSpecialTrainingImg(stChk) {
  [...Array(6).keys()].forEach((num) => {
    // 특훈 표시
    // 1. 각 위치의 Div의 세팅 수정
    // 2. 선택된 카드가 없다면 해당 위치의 특훈 설정은 비활성화
    // 3. 특훈 이미지들을 모두 보이도록 설정
    if (stChk == true) {
      $(`#selectedIdolView_${num}`).attr("class", "idol_view_st");
      if ($(`#selectedIdolView_${num}_card`).length > 0) {
        $(`#specialTrainingInput_${num}`).prop("disabled", false);
      }
      $(".specialTrainingStar").css("visibility", "visible");

      for (var exIdx = 1; exIdx <= 3; exIdx++) {
        $(`#selectedIdol_${num}_ex_${exIdx}`).attr("class", "ex_view_st");
      }
    }
    // 특훈 비표시
    // 1. 각 위치의 Div의 세팅 수정
    // 2. 해당 위치의 특훈 설정을 비활성화
    // 3. 특훈 이미지들을 모두 보이지 않도록 설정
    else {
      $(`#selectedIdolView_${num}`).attr("class", "idol_view");
      $(`#specialTrainingInput_${num}`).prop("disabled", true);
      $(".specialTrainingStar").css("visibility", "hidden");

      for (var exIdx = 1; exIdx <= 3; exIdx++) {
        $(`#selectedIdol_${num}_ex_${exIdx}`).attr("class", "ex_view");
      }
    }
  });
}

/**
 * 지정한 위치의 카드에 특훈 데이터를 표시
 */
function setSpecialTraining(pos, starNum) {
  var divId = `#selectedIdolView_${pos}`;
  var starPos = {
    1: { bottom: 22, right: 85 },
    2: { bottom: 37, right: 85 },
    3: { bottom: 53, right: 85 },
    4: { bottom: 70, right: 84 },
  };

  // 기존의 특훈 이미지는 삭제
  $(`#specialTrainingStar_${pos}`).remove();

  // 카드 이미지를 설정하지 않은 경우 0으로 고정 후 종료
  if ($(`${divId}_card`).length == 0) {
    $(`#specialTrainingInput_${pos}`).val(0);
    return;
  }

  // 0 <= starNum <= 4 가 되도록 조정
  var setStarNum = starNum;
  setStarNum = setStarNum > 4 ? 4 : setStarNum;
  setStarNum = setStarNum < 0 ? 0 : setStarNum;

  // Input 폼에 보정된 특훈 수를 입력
  $(`#specialTrainingInput_${pos}`).val(setStarNum);

  // 특훈 수가 1이상인 경우
  // 해당 위치의 카드에 특훈 이미지를 표시
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

/**
 * 특훈 수 변경 버튼의 처리
 */
function setSpecialTrainingCount(pos, num) {
  if ($(`#specialTrainingInput_${pos}`).is(":disabled") != true) {
    var newVal = Number($(`#specialTrainingInput_${pos}`).val()) + num;
    $(`#specialTrainingInput_${pos}`).val(newVal);
    setSpecialTraining(pos, newVal);
  }
}

/**
 * 서포터 아이돌 이미지에 각 옵션 능력 아이콘 표시 설정
 */
function convertOptionAbilityImg(optionVal) {
  [...Array(5).keys()]
    .map((v) => v + 1)
    .forEach((offset) => {
      var imgCode = $(`#selectedIdolCharViewDiv_Support_${offset}`).children("img");

      // 히라메키 선택시, 아이돌선택과 카드선택에 히라메키 표시
      $(`#selectedIdolCharViewDiv_Support_${offset}`).html("");
      if (imgCode.length > 0) {
        var idolNameSrc = imgCode.attr("name");
        var insight = imgCode.attr("insight");

        if (optionVal == "insight") {
          $(`#selectedIdolCharViewDiv_Support_${offset}`).append(
            $("<img>", getIdolImg(idolNameSrc, insight))
          );
          $(`#selectedIdolCharViewDiv_Support_${offset}`).append(
            $("<img>", getInsightImg(insight, 1))
          );
        } else {
          $(`#selectedIdolCharViewDiv_Support_${offset}`).append(
            $("<img>", getIdolImg(idolNameSrc, insight))
          );
        }
      }

      // 덱 히라메키 표시
      $(`#selectedIdol_${offset}_option`).html("");
      var selectedCard = $(`#selectedIdolView_${offset}`).children("img");

      if (optionVal == "idea") {
        // 덱에 아이디어 표시
        $(`#selectedIdol_${offset}_option`).css("display", "block");
        if (imgCode.length > 0 && selectedCard.length > 0) {
          // 카드에 저장된 아이디어 정보를 취득
          var optionByCard = selectedCard.attr("idea");
          if (optionByCard != undefined) {
            $(`#selectedIdol_${offset}_option`).append($("<img>", getIdeaImg(optionByCard)));
          } else {
            $(`#selectedIdol_${offset}_option`).append(
              $("<img>", {
                src: "",
              })
            );
          }
        }
      } else if (optionVal == "insight") {
        // 덱에 히라메키 표시
        $(`#selectedIdol_${offset}_option`).css("display", "block");
        if (imgCode.length > 0 && selectedCard.length > 0) {
          // 카드에 저장된 히라메키 정보를 취득
          var optionByCard = selectedCard.attr("insight");
          if (optionByCard != undefined) {
            $(`#selectedIdol_${offset}_option`).append($("<img>", getInsightImg(optionByCard, 2)));
          } else {
            $(`#selectedIdol_${offset}_option`).append(
              $("<img>", {
                src: "",
              })
            );
          }
        }
      } else if (optionVal == "proficiency") {
        // 덱에 악곡숙련도 표시
        $(`#selectedIdol_${offset}_option`).css("display", "block");
        if (imgCode.length > 0 && selectedCard.length > 0) {
          // 카드에 저장된 숙련도 정보를 취득
          var optionByCard = selectedCard.attr("proficiency");
          if (optionByCard != undefined) {
            $(`#selectedIdol_${offset}_option`).append($("<img>", getProficiencyImg(optionByCard)));
          } else {
            $(`#selectedIdol_${offset}_option`).append(
              $("<img>", {
                src: "",
              })
            );
          }
        }
      } else {
        $(`#selectedIdol_${offset}_option`).css("display", "none");
      }
    });

  // 프로듀스 카드는 옵션이 없지만 레이아웃을 맞추기 위해 조정
  if (optionVal != "none") {
    $(`#selectedIdol_0_option`).css("display", "block");
  } else {
    $(`#selectedIdol_0_option`).css("display", "none");
  }
}

/**
 * EX Skill
 */
function viewExDialog(parentObj, cardType, divOffset, exOffset) {
  $(exDialogDivId).html("");
  var exNum = 0;
  var exPrefix = cardType.toLowerCase();
  var exList;

  if (cardType == "P") {
    exNum = 76;
  } else if (cardType == "S") {
    exNum = 59;
  }

  exList = [...Array(exNum + 1).keys()].map((v) => {
    var exNameSrc = `${exPrefix}_${v}`;
    if (v == 0) exNameSrc = "none";
    return exNameSrc;
  });

  exList.forEach((exNameSrc) => {
    // EX스킬 아이콘 표시
    $(exDialogDivId).append(
      $("<img>", {
        id: `ex_${exNameSrc}`,
        src: `./img/ex_skill/${exNameSrc}.png`,
        width: "76px",
        height: "76px",
        class: "dialogImg",
        onerror: "this.src='./img/ex_skill/none.png'",
      })
    );

    // EX스킬 아이콘 클릭시 처리
    $(`#ex_${exNameSrc}`).click(function () {
      var selDivId = `#selectedIdol_${divOffset}_ex_${exOffset}`;
      $(selDivId).html(
        $("<img>", {
          id: `${selDivId.replace("#", "")}_icon`,
          src: `./img/ex_skill/${exNameSrc}.png`,
          width: "76px",
          height: "76px",
          onerror: "this.src='./img/ex_skill/none.png'",
        })
      );
      $(exDialogDivId).dialog("close");
    });
  });

  var dialogTitle = getLanguageStringByData(viewLanguage, "selectEx");
  // 다이얼로그 세팅
  $(exDialogDivId).dialog({
    modal: true,
    title: dialogTitle,
    position: { my: "left top", at: "center", of: parentObj, collision: "fit" },
    width: "600px",
  });

  $(".ui-widget-overlay").click(function () {
    $(exDialogDivId).dialog("close");
  });
}

function convertExSkill(exChk) {
  for (var offset = 0; offset <= 5; offset++) {
    var exDiv = $(`#selectedIdol_${offset}_ex`);

    if (exChk == true) {
      exDiv.css("display", "block");
    } else {
      exDiv.css("display", "none");
    }
  }
}

/**
 * EX스킬 아이콘을 초기화
 */
function exReset(divPos) {
  [...Array(3).keys()]
    .map((v) => v + 1)
    .forEach((exPos) => {
      $(`#selectedIdol_${divPos}_ex_${exPos}`)
        .children("img")
        .attr("src", "./img/ex_skill/none.png");
    });
}

/**
 * 프로듀스 덱을 초기화
 */
function produceViewListReset(pDeckCardPosAry) {
  pDeckCardPosAry.forEach((pos) => {
    // 덱의 카드 아이콘을 초기화
    viewReset(`${pos}_card`);

    // EX 초기화
    exReset(pos);

    // 특훈 초기화
    $(`#specialTrainingInput_${pos}`).val(0);
    setSpecialTraining(pos, $(`#specialTrainingInput_${pos}`).val());

    // 옵션(아이디어, 히라메키, 악곡숙련도) 초기화
    $(`#selectedIdol_${pos}_option`).html("");
    $(`#selectedIdol_${pos}_option`).append(
      $("<img>", {
        src: "",
      })
    );
  });

  // 특훈 설정 비활성화
  // 현재 설정상태를 변경 후 원래대로 복구
  convertSpecialTrainingImg(!$("#specialTrainingConvertBtn").is(":checked"));
  convertSpecialTrainingImg($("#specialTrainingConvertBtn").is(":checked"));
}

/**
 * 프로듀스덱 미선택 카드의 아이콘 표시
 */
function convertProduceNoneCardIcon(iconChk) {
  [...Array(6).keys()].forEach((divPos) => {
    var selDivId = `#selectedIdolView_${divPos}`;
    if (iconChk) {
      if ($(selDivId).children("img").length < 1) {
        setSelectCard(selDivId, `assets/`, "Blank_Idol");
      }
    } else {
      if ($(`${selDivId}_card`).attr("src") == `${blankIdolIcon}`) {
        // 덱 아이콘 초기화
        viewReset(`${divPos}_card`);

        // EX 초기화
        exReset(divPos);

        // 특훈 초기화
        $(`#specialTrainingInput_${divPos}`).val(0);
        setSpecialTraining(divPos, $(`#specialTrainingInput_${divPos}`).val());

        // 옵션(아이디어, 히라메키, 악곡숙련도) 초기화
        $(`#selectedIdol_${divPos}_option`).html("");
        $(`#selectedIdol_${divPos}_option`).append(
          $("<img>", {
            src: "",
          })
        );

        // 특훈 설정 비활성화
        // 현재 설정상태를 변경 후 원래대로 복구
        convertSpecialTrainingImg(!$("#specialTrainingConvertBtn").is(":checked"));
        convertSpecialTrainingImg($("#specialTrainingConvertBtn").is(":checked"));
      }
    }
  });
}
