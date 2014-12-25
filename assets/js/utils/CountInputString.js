var $ = require('jquery');

function CountInputString(args){

  /*
  * 【インターフェース】
  * inputTargetId: input type="text"やtextareaにIDに付与してそのIDを渡す
  * limitedStringId: 制限文字数を明示的に出力する部分のDOMをIDで渡す
  * limitedStringSize: 上限文字数
  * callBackInputString: functionの場合は入力アクションの都度、入力内容を返す
  */

  this.$inputTargetId = $('#' + args.inputTargetId);
  this.$limitedStringId = $('#' + args.limitedStringId);
  this.limitedStringSize = Number(args.limitedStringSize);
  this.callBackInputString = (args.callBackInputString) ? args.callBackInputString :false;

  this.STATUS_STRINGS = {
    1: '文字まで',
    2: 'あと',
    3: '文字'
  };
}

var proto = CountInputString.prototype;

proto.init = function () {
  var inputVal = this.getInputVal(this.$inputTargetId.val());

  this.setLimitedStringStatus(inputVal);
  this.eventInit();
};

proto.eventInit = function () {
  var that = this;

  this.$inputTargetId.keydown(function () {
    var inputVal = that.getInputVal(that.$inputTargetId.val());

    if(that.setLimitedStringStatus(inputVal)){
      that.$limitedStringId.html(that.setLimitedStringStatus(inputVal));
    }

    if(that.callBackInputString){
      that.callBackInputString(inputVal);
    }
  });

  this.$inputTargetId.keyup(function () {
    var inputVal = that.getInputVal(that.$inputTargetId.val());

    that.setLimitedStringStatus(that.$inputTargetId.val());
    if(that.callBackInputString){
      that.callBackInputString(inputVal);
    }
  });

};

//todo:unit-test
proto.setLimitedStringStatus = function (val) {
  var inputVal = this.getInputVal(val);

  if(!inputVal){
    this.$limitedStringId.html( this.limitedStringSize + this.STATUS_STRINGS[1] );

    return false;
  }

  var remainingSize = this.limitedStringSize - inputVal.length;

  if(remainingSize < 0){
    return this.STATUS_STRINGS[2] +
           '<span class="limitText">' + remainingSize + '</span>' +
           this.STATUS_STRINGS[3];
  }else{
    return this.STATUS_STRINGS[2] +
           remainingSize +
           this.STATUS_STRINGS[3];
  }
};

//todo:unit-test
proto.getInputVal = function (beforeProcessingVal) {
  var afterProcessingVal = beforeProcessingVal.replace((new RegExp('\r\n','g')),'');
  afterProcessingVal = afterProcessingVal.replace((new RegExp('\n','g')),'');

  return afterProcessingVal;
};

// export
module.exports = CountInputString;