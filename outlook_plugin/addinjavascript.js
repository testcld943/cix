var mailboxItem;

    Office.initialize = function (reason) {
        mailboxItem = Office.context.mailbox.item;
    }

    // Entry point Message Body Checker add-in before send is allowed.
    // <param name="event">ItemSend event is automatically passed by on send code to the function specified in the manifest.</param>
    function validateBody(event) {
        mailboxItem.body.getAsync("html", { asyncContext: event }, checkBodyOnlyOnSendCallBack);
    }

//The function is using the javascript string search to validate .We have to call the restapi endpoint of NLP

 function checkBodyOnlyOnSendCallBack(asyncResult) {
        var listOfBlockedWords = new Array("blockedword", "blockedword1", "blockedword2");
        var wordExpression = listOfBlockedWords.join('|');

        // \b to perform a "whole words only" search using a regular expression in the form of \bword\b.
        // i to perform case-insensitive search.
        var regexCheck = new RegExp('\\b(' + wordExpression + ')\\b', 'i');
        var checkBody = regexCheck.test(asyncResult.value);

//Call the restapi endpoint  of the NLP passing "asyncResult.value" as input.
//The result can be passed as mailbox notification messgae

        if (checkBody) {
            mailboxItem.notificationMessages.addAsync('NoSend', { type: 'errorMessage', message: 'Blocked words have been found in the body of this email. Please remove them.' });
            // Block send.
            asyncResult.asyncContext.completed({ allowEvent: false });
        }

        // Allow send.
        asyncResult.asyncContext.completed({ allowEvent: true });
    }
