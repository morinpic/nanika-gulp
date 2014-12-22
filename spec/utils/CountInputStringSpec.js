var CountInputString = require('../../assets/js/utils/CountInputString');

describe('CountInputStringSpec', function () {

  var stub1 = {
    inputTargetId: 'stubUserIdInput',
    limitedStringId: 'stubUserIdInputResult',
    limitedStringSize: 20
  };

  var countInputString = new CountInputString(stub1);

  it('入力文字数ごとのテスト', function () {
    var nullText = '';
    var hasText = '文字列が制限数以内入っています';
    var overText = new Array(22).join('a');

    expect(countInputString.setLimitedStringStatus(nullText)).toEqual(false);
    expect(countInputString.setLimitedStringStatus(hasText)).toEqual('あと5文字');
    expect(countInputString.setLimitedStringStatus(overText)).toEqual('あと<span class="limitText">-1</span>文字');
  });
});
