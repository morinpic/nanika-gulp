var CountInputString = require('../utils/CountInputString');

module.exports = function(){
  new CountInputString({
    inputTargetId: 'welcomeUserIdInput',
    limitedStringId: 'welcomeUserIdInputResult',
    limitedStringSize: 20
  });

  new CountInputString({
    inputTargetId: 'welcomeUserNameInput',
    limitedStringId: 'welcomeUserNameInputResult',
    limitedStringSize: 16
  });

  new CountInputString({
    inputTargetId: 'welcomeUserDescriptionInput',
    limitedStringId: 'welcomeUserDescriptionResult',
    limitedStringSize: 150
  });
};
