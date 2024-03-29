import * as model from "./model.js";
const loadOnSignUpBtn = document.querySelector(".signInBtnLodader");
const loadOnLogBtn = document.querySelector(".loginBtnLodader");
const message2 = document.querySelector(".message1");
const btnLogin = document.querySelector(".btn-login");
const toRegister = document.querySelector(".to-register");
const toLogin = document.querySelector(".to-login");
const btnSignup = document.querySelector(".btn-signup");

const loginAlready=function(){
 
    let userData = JSON.parse(localStorage.getItem("user"));
   
if (userData) window.location="cvengine.html";
  
}
loginAlready()
toRegister.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".register-section").style.left = "40px";
  document.querySelector(".login-section").style.left = "450px";
});
const fromRegisterToLogin = function () {
  document.querySelector(".register-section").style.left = "450px";
  document.querySelector(".login-section").style.left = "40px";
};
toLogin.addEventListener("click", (e) => {
  e.preventDefault();
  fromRegisterToLogin();
});


btnLogin.addEventListener("click", async function (e) {
  try {
    e.preventDefault();
    const formData = Object.fromEntries([
      ...new FormData(this.closest("form")),
    ]);
    const { password, email } = formData;
    if (!email)
      return (document.querySelector(".message2").textContent =
        "Can not supmit without email");

    model.state.user.email = email;
    model.state.user.password = password;
    loadOnLogBtn.classList.add("show-btn-loader");
    document.querySelector(".message2").textContent = `Please Wait...`;
    const res = await axios.post("https://lionfish-app-g5i4e.ondigitalocean.app/user/login", {
      ...model.state.user,
    });

    if (res.data.data === "1") {
      model.state.user.isGonGon = true;
      let user = {
        isGonGon: model.state.user.isGonGon,
      };
      localStorage.setItem("user", JSON.stringify(user));

      window.location="cvengine.html";
      return 1
    }

    model.state.user.accesstoken = model.state.user.token = res.data.accesstoken;
    if (!model.state.user.accesstoken) {
      document.querySelector(".message2").textContent =
        "User or password incorrect";
      loadOnLogBtn.classList.remove("show-btn-loader");
      return console.log("settled");
    }

    let user = {
      email: res.data.user.email,
      siteUserName: res.data.user.userName,
      userid: res.data.user._id,
      editor: res.data.user.editor,
      accesstoken: model.state.user.accesstoken,
    };

    if (!res.data.user.isVerified) {
      register(res.data.user);
      document.querySelector(
        ".message2"
      ).textContent = `Check your email for verification`;
      loadOnLogBtn.classList.remove("show-btn-loader");

      return console.log("settled");
    }

    localStorage.setItem("user", JSON.stringify(user));

    window.location="cvengine.html"
  } catch (error) {
    console.log(error);
  }
});
document.querySelector(".goto-login").addEventListener("click", function (e) {
  let mailSends = document.querySelector(".welcome-message");
  mailSends.style.opacity = "0";
  mailSends.style.left = "1000px";
  mailSends.style.zIndex = "999";
  fromRegisterToLogin();
});
const register = async function (user) {
  const res = await axios.post("https://lionfish-app-g5i4e.ondigitalocean.app/user/register", {
    ...user,
  });
  if(res.data.msg)  message2.textContent=res.data.msg;
  // console.log(res)
  loadOnLogBtn.classList.remove("show-btn-loader");
  loadOnSignUpBtn.classList.remove("show-btn-loader");
  // return console.log(res)
  if (!res.data.result.MessageId)
    return (message2.textContent = `We are having problem verifying your account. We will notify you anytime the problem is fixed!`);
  let mailSends = document.querySelector(".welcome-message");
  mailSends.style.opacity = "1";
  mailSends.style.left = "0";
  mailSends.style.zIndex = "999";
};
btnSignup.addEventListener("click", async function (e) {
  e.preventDefault();
  try {
    const formData = Object.fromEntries([
      ...new FormData(this.closest("form")),
    ]);
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword)
      return (message2.innerText = "Password did not match");
    loadOnSignUpBtn.classList.add("show-btn-loader");
    message2.innerText = "Please Wait...";
    model.state.user = formData;
    register(model.state.user);
  } catch (error) {
    console.log(error);
  }
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
 checkFlexGap();
