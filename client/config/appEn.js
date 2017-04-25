/*eslint no-multi-str:0*/
if(!window.mediaCenter) {
    window.mediaCenter = {};
}
window.mediaCenter.appEn = {
    "locales": ["en"],

    "messages": {
        "loginPage": {
            "login": {
                "loginButton": "Sign in",
                "userNamePlaceHolder": "Username",
                "passwordPlaceHolder": "Password",
                "loginHelpLabel": "Need help to login"
            },
            "getStarted": "get started for free",
            "watchDemo": "Watch Makenews Demo",
            "branding": {
                "text": "MakeNews is for journalists and newsrooms. It helps you track news from web and social media in real-time."
            },
            "featuresHelp": {
                "configureHelp": {
                    "name": "Add news sources",
                    "text": "Identify and add all your favourite sources from RSS feeds, Facebook and Twitter to aggregate these and create a one stop destination for all your news."
                },
                "scanNewsHelp": {
                    "name": "Scan news articles",
                    "text": "Don’t miss out on any news. Look out for all the trending and latest news. Save and sort your references and make your own news collections."
                },
                "writeStoryHelp": {
                    "name": "Write your story",
                    "text": "Write and export your own story while referring to your collections and the news world."
                }
            }
        },
        "changePassword": {
            "passwordUpdateFailure": "Password update failed",
            "invalidCredentials": "Incorrect Current Password",
            "newPwdConfirmPwdMismatch": "New Password and Confirm Password do not match",
            "currentPassword": "current password",
            "newPassword": "new password",
            "confirmPassword": "confirm password",
            "newPwdShouldNotMatchCurrentPwd": "New Password should not be same as the Current Password",
            "pwdChangeSuccessful": "Password successfully changed",
            "pwdShouldNotBeEmpty": "Passwords cannot be left blank",
            "logoutConfirmMessage": "Your password has been successfully changed. The application will now logout. Please re-login with your new password"
        },
        "userProfileStrings": {
            "changePassword": "Change Password",
            "logout": "Logout",
            "help": "Help & FAQs"
        },
        "newsBoard": {
            "trending": "Please configure sources on configure page",
            "web": "Please configure web sources on configure page",
            "facebook": "Please configure facebook sources on configure page",
            "twitter": "Please configure twitter sources on configure page",
            "bookmark": "Please bookmark the feeds",
            "noFeeds": "No feeds to display"
        },
        "storyBoard": {
            "confirmDelete": "Are you sure you want to delete the story?"
        },
        "applicationTour": {
            "description": "Find HELP in the above options",
            "gotItText": "Got It"
        },
        "mainHeaderStrings": {
            "newsBoard": "Scan News",
            "storyBoard": "Write a Story",
            "configure": "Configure"
        },
        "confirmPopup": {
            "ok": "OK",
            "confirm": "CONFIRM",
            "cancel": "CANCEL"
        },
        "FAQs": [
            {
                "question": "What is the purpose of the application?",
                "answer": "To act as an aggregator for news items from different sources like RSS feeds, Facebook Page and Twitter Handles or Hashtags"
            }
        ],
        "configurePage": {
            "header": {
                "mySources": "My Sources",
                "web": "Web URLs",
                "facebook": {
                    "name": "Facebook",
                    "tabs": {
                        "pages": "Pages",
                        "groups": "Groups"
                    }
                },
                "twitter": "Twitter",
                "next": "Next",
                "done": "Done",
                "signIn": "Sign in"
            },
            "addAll": "Add All",
            "addCustomUrl": {
                "name": "Add custom url",
                "description": {
                    "web": "Please enter the link below to add a new web source.",
                    "pages": "Please enter the link below to add a new page source.",
                    "twitter": "Please enter the link below to add a new twitter source."
                },
                "exampleUrls": {
                    "web": "http://economictimes.indiatimes.com/rssfeedsdefault.cms",
                    "pages": "https://www.facebook.com/TimesofIndia",
                    "twitter": "@timesofindia"
                },
                "messages": {
                    "validateUrl": "Please enter proper url",
                    "success": "Added Successfully"
                }
            }
        }
    }
};
