# Zoom Meeting SDK React sample

Use of this sample app is subject to our [Terms of Use](https://explore.zoom.us/en/legal/zoom-api-license-and-tou/).

## 安装

1. 安装npm依赖

   `$ npm install`

2. 打开 `src/App.js` 文件, 修改配置.

   **NEW:** To use the [Component View](https://developers.zoom.us/docs/meeting-sdk/web/component-view/), replace `App.js` with `App-New.js`. (The `leaveUrl` is not needed). Also, uncomment the Component View CSS tags and comment out the Client View CSS in `public/index.html`.

   | Variable                   | Description |
   | -----------------------|-------------|
   | authEndpoint          | Required, your Meeting SDK auth endpoint that securely generates a Meeting SDK JWT. [Get a Meeting SDK auth endpoint here.](https://github.com/zoom/meetingsdk-sample-signature-node.js) |
   | sdkKey                   | Required, your Zoom Meeting SDK Key or Client ID for Meeting SDK app type's created after February 11, 2023. [You can get yours here](https://developers.zoom.us/docs/meeting-sdk/developer-accounts/#get-meeting-sdk-credentials). |
   | meetingNumber                   | Required, the Zoom Meeting or webinar number. |
   | passWord                   | Optional, meeting password. Leave as empty string if the meeting does not require a password. |
   | role                   | Required, `0` to specify participant, `1` to specify host. |
   | userName                   | Required, a name for the user joining / starting the meeting / webinar. |
   | userEmail                   | Required for Webinar, optional for Meeting, required for meeting and webinar if [registration is required](https://support.zoom.us/hc/en-us/articles/360054446052-Managing-meeting-and-webinar-registration). The email of the user starting or joining the meeting / webinar. |
   | registrantToken            | Required if your [meeting](https://developers.zoom.us/docs/meeting-sdk/web/client-view/meetings/#join-meeting-with-registration-required) or [webinar](https://developers.zoom.us/docs/meeting-sdk/web/client-view/webinars/#join-webinar-with-registration-required) requires [registration](https://support.zoom.us/hc/en-us/articles/360054446052-Managing-meeting-and-webinar-registration). |
   | zakToken            | Required to start meetings or webinars on external Zoom user's behalf, the [authorized Zoom user's ZAK token](https://developers.zoom.us/docs/meeting-sdk/auth/#start-meetings-and-webinars-with-a-zoom-users-zak-token). The ZAK can also be used to join as an [authenticated participant](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0063837). |
   | leaveUrl                   | Required for Client View, the url the user is taken to once the meeting is over. |

   Example:

   ```js
   var authEndpoint = 'http://localhost:4000'
   var sdkKey = 'abc123'
   var meetingNumber = '123456789'
   var passWord = ''
   var role = 0
   var userName = 'React'
   var userEmail = ''
   var registrantToken = ''
   var zakToken = ''
   var leaveUrl = 'http://localhost:3000'
   ```
3. 根目录创建.env文件并添加key和secret
```
ZOOM_MEETING_SDK_KEY=xxxx
ZOOM_MEETING_SDK_SECRET=xxx
```

# 运行:

1. Run server:

   `$ npm run server`

2. Run the app:

   `$ npm run start`

3. 浏览器打开http://localhost:3000 并点击 "Join Meeting".

   ### Client View

   ![Zoom Meeting SDK Client View](/public/images/meetingsdk-web-client-view.gif)

   ### Component View

   ![Zoom Meeting SDK Component View](/public/images/meetingsdk-web-component-view.gif)

   Learn more about [Gallery View requirements](https://developers.zoom.us/docs/meeting-sdk/web/gallery-view/) and [see more product screenshots](https://developers.zoom.us/docs/meeting-sdk/web/gallery-view/#how-views-look-with-and-without-sharedarraybuffer).
