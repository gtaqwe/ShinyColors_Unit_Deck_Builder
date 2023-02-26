/**
 * 페스 포지션 이미지 설정
 */
function setFesPosIcon() {
  posIconType = $(`input[name="fesPosIcon"]:checked`).val();

  // 포지션 div 삭제
  FES_POSITION.forEach((pos) => {
    $(`#selectedIdolView_${pos}_pos`).remove();
  });

  // 포지션 아이콘 타입 선택시 해당하는 아이콘 표시
  if (posIconType != 0) {
    FES_POSITION.forEach((pos) => {
      // 해당위치에 카드를 이미 선택한 경우 And 미선택 카드 아이콘이 아닌 경우에만 포지션 아이콘 표시
      if (
        $(`#selectedIdolView_${pos}_card`).length > 0 &&
        $(`#selectedIdolView_${pos}_card`).attr("src") !== `${blankIdolIcon}`
      ) {
        // 포지션 아이콘을 표시
        $(`#selectedIdolView_${pos}`).append(
          $("<img>", {
            id: `selectedIdolView_${pos}_pos`,
            src: `./img/assets/${pos}_Position_${posIconType}.png`,
            width: "26px",
            height: "26px",
          })
            .css("position", "relative")
            .css("bottom", `97px`)
            .css("left", `3px`)
        );
      }
    });
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
    str = "fesIcon";
    // $("#toggleStr").html("페스");
  } else {
    str = "casualIcon";
    // $("#toggleStr").html("사복");
  }
  $("#toggleStr").html(getLanguageStringByData(viewLanguage, str));
}

/**
 * 페스와 사복 아이콘 표시 설정에 따라 이미지를 변경
 */
function convertFesDeckImg(fesChk) {
  FES_POSITION.forEach((pos) => {
    var imgUrl = $(`#selectedIdolView_${pos}_card`).attr("src");
    if (imgUrl != undefined) {
      if (fesChk == true) {
        imgUrl = imgUrl.replace("icon_normal/", "icon_fes/");
      } else {
        imgUrl = imgUrl.replace("icon_fes/", "icon_normal/");
      }
      $(`#selectedIdolView_${pos}_card`).attr("src", imgUrl);
    }
  });
}

/**
 * 프로듀스 덱을 초기화
 */
function fesViewListReset(fDeckCardPosAry) {
  fDeckCardPosAry.forEach((pos) => {
    // 덱의 카드 아이콘을 초기화
    viewReset(`${pos}_card`);

    // 덱의 포지션 아이콘을 초기화
    viewReset(`${pos}_pos`);
  });
}

/**
 * 프로듀스덱 미선택 카드의 아이콘 표시
 */
function convertFesNoneCardIcon(iconChk) {
  FES_POSITION.forEach((divPos) => {
    var selDivId = `#selectedIdolView_${divPos}`;
    if (iconChk) {
      if ($(selDivId).children("img").length < 1) {
        setSelectCard(selDivId, `assets/`, "Blank_Idol");
      }
    } else {
      if ($(`${selDivId}_card`).attr("src") == blankIdolIcon) {
        viewReset(`${divPos}_card`);
        viewReset(`${divPos}_pos`);
      }
    }
  });
}
