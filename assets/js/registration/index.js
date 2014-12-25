var CountInputString = require('../utils/CountInputString');

module.exports = function(){

  new CountInputString({
    inputTargetId: 'welcomeUserIdInput',
    limitedStringId: 'welcomeUserIdInputResult',
    limitedStringSize: 20
  }).init();

  new CountInputString({
    inputTargetId: 'welcomeUserNameInput',
    limitedStringId: 'welcomeUserNameInputResult',
    limitedStringSize: 16
  }).init();

  new CountInputString({
    inputTargetId: 'welcomeUserDescriptionInput',
    limitedStringId: 'welcomeUserDescriptionResult',
    limitedStringSize: 150
  }).init();
};
