
var nodemailer = require('nodemailer');
var uuid = require('node-uuid');
var fs = require('fs');
const config = require('../config.json');

html1 = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="initial-scale=1.0"><meta name="format-detection" content="telephone=no"><title>MOSAICO Responsive Email Designer</title><style type="text/css">.socialLinks {font-size: 6px;}
.socialLinks a {display: inline-block;}
.socialIcon {display: inline-block;vertical-align: top;padding-bottom: 0px;border-radius: 100%;}
table.vb-row.halfpad {border-spacing: 0;padding-left: 9px;padding-right: 9px;}
table.vb-row.fullwidth {border-spacing: 0;padding: 0;}
table.vb-container.fullwidth {padding-left: 0;padding-right: 0;}</style><style type="text/css">
    /* yahoo, hotmail */
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{ line-height: 100%; }
    .yshortcuts a{ border-bottom: none !important; }
    .vb-outer{ min-width: 0 !important; }
    .RMsgBdy, .ExternalClass{
      width: 100%;
      background-color: #3f3f3f;
      background-color: #3f3f3f}

    /* outlook */
    table{ mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
    #outlook a{ padding: 0; }
    img{ outline: none; text-decoration: none; border: none; -ms-interpolation-mode: bicubic; }
    a img{ border: none; }

    @media screen and (max-device-width: 600px), screen and (max-width: 600px) {
      table.vb-container, table.vb-row{
        width: 95% !important;
      }

      .mobile-hide{ display: none !important; }
      .mobile-textcenter{ text-align: center !important; }

      .mobile-full{
        float: none !important;
        width: 100% !important;
        max-width: none !important;
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
      img.mobile-full{
        width: 100% !important;
        max-width: none !important;
        height: auto !important;
      }
    }
  </style><style type="text/css">#ko_sideArticleBlock_4 .links-color a:visited, #ko_sideArticleBlock_4 .links-color a:hover {color: #3f3f3f;color: #3f3f3f;text-decoration: underline;}
#ko_footerBlock_2 .links-color a:visited, #ko_footerBlock_2 .links-color a:hover {color: #ccc;color: #ccc;text-decoration: underline;}</style></head><body bgcolor="#3f3f3f" text="#919191" alink="#cccccc" vlink="#cccccc" style="margin: 0;padding: 0;background-color: #3f3f3f;color: #919191;">

  <center>

  <!-- preheaderBlock -->

  <!-- /preheaderBlock -->

  <table class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#d8d8d8" style="background-color: #d8d8d8;" id="ko_sideArticleBlock_4"><tbody><tr><td class="vb-outer" align="center" valign="top" bgcolor="#d8d8d8" style="padding-left: 9px;padding-right: 9px;background-color: #d8d8d8;">

<!--[if (gte mso 9)|(lte ie 8)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->
        <div class="oldwebkit" style="max-width: 570px;">
        <table width="570" border="0" cellpadding="0" cellspacing="9" class="vb-row fullpad" bgcolor="#f2f2f2" style="border-collapse: separate;border-spacing: 9px;width: 100%;max-width: 570px;background-color: #f2f2f2;"><tbody><tr><td align="center" class="mobile-row" valign="top" style="font-size: 0;">

<!--[if (gte mso 9)|(lte ie 8)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="552"><tr><![endif]-->

<!--[if (gte mso 9)|(lte ie 8)]><td align="left" valign="top" width="184"><![endif]-->
<div class="mobile-full" style="display: inline-block; max-width: 184px; vertical-align: top; width: 100%;">

                    <table class="vb-content" border="0" cellspacing="9" cellpadding="0" width="184" align="left" style="border-collapse: separate;width: 100%;"><tbody><tr><td width="100%" valign="top" align="left" class="links-color">
                            <img border="0" hspace="0" vspace="0" width="166" class="mobile-full" alt="" style="border: 0px;display: block;vertical-align: top;width: 100%;height: auto;max-width: 166px;" src="http://isek.se/wp-content/uploads/2016/06/I-sektionen.png"></a>
                        </td>
                      </tr></tbody></table></div><!--[if (gte mso 9)|(lte ie 8)]></td>
<![endif]--><!--[if (gte mso 9)|(lte ie 8)]>
<td align="left" valign="top" width="368">
<![endif]--><div class="mobile-full" style="display: inline-block; max-width: 368px; vertical-align: top; width: 100%;">

                    <table class="vb-content" border="0" cellspacing="9" cellpadding="0" width="368" align="left" style="border-collapse: separate;width: 100%;"><tbody><tr><td style="font-size: 18px; font-family: Arial, Helvetica, sans-serif; color: #3f3f3f; text-align: left;">
                          <span style="color: #3f3f3f;">Välkommen till` + config.name + `<br></span>
                        </td>
                      </tr><tr><td align="left" class="long-text links-color" style="text-align: left; font-size: 13px; font-family: Arial, Helvetica, sans-serif; color: #3f3f3f;"><p style="margin: 1em 0px;margin-bottom: 0px;margin-top: 0px;">Detta är din personliga länk för att kunna delta i röstningen, klicka på knappen för att sätta igång!<br></p></td>
                      </tr><tr><td valign="top">
                            </tr></tbody></table></td>
                      </tr></tbody></table></div><!--[if (gte mso 9)|(lte ie 8)]></td>
<![endif]-->
<!--[if (gte mso 9)|(lte ie 8)]></tr></table><![endif]-->

            </td>
          </tr></tbody></table></div>
<!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
      </td>
    </tr></tbody></table><table class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#d8d8d8" style="background-color: #d8d8d8;" id="ko_buttonBlock_3"><tbody><tr><td class="vb-outer" align="center" valign="top" bgcolor="#d8d8d8" style="padding-left: 9px;padding-right: 9px;background-color: #d8d8d8;">

<!--[if (gte mso 9)|(lte ie 8)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->
        <div class="oldwebkit" style="max-width: 570px;">
        <table width="570" border="0" cellpadding="0" cellspacing="18" class="vb-container fullpad" bgcolor="#f2f2f2" style="border-collapse: separate;border-spacing: 18px;padding-left: 0;padding-right: 0;width: 100%;max-width: 570px;background-color: #f2f2f2;"><tbody><tr><td valign="top" bgcolor="#f2f2f2" align="center" style="background-color: #f2f2f2;">

              <table cellpadding="0" border="0" align="center" cellspacing="0" class="mobile-full"><tbody><tr><td width="auto" valign="middle" bgcolor="#31859b" align="center" height="50" style="font-size: 22px; font-family: Arial, Helvetica, sans-serif; color: #ffffff; font-weight: normal; padding-left: 14px; padding-right: 14px; background-color: #31859b; border-radius: 4px;">
                    <a target="_new" href="
`;

html2 = `" style="text-decoration: none; color: #ffffff; font-weight: normal;">Börja Rösta<br></a></td>
                </tr></tbody></table></td>
          </tr></tbody></table></div>
<!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
      </td>
    </tr></tbody></table><!-- footerBlock --><table width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="#3f3f3f" style="background-color: #3f3f3f;" id="ko_footerBlock_2"><tbody><tr><td align="center" valign="top" bgcolor="#3f3f3f" style="background-color: #3f3f3f;">

<!--[if (gte mso 9)|(lte ie 8)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->

            </td>
          </tr></tbody></table></div>
<!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
      </td>
    </tr></tbody></table><!-- /footerBlock --></center>

</body></html>
`;

html3 = ``;


var credentials = require('../credentials.json').email;

module.exports = function(email, callback) {

  const uid = uuid.v4();

  var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: credentials.username, // Your email id
            pass: credentials.password // Your password
        }
    });

    var mailOptions = {
      from: credentials.email, // sender address
      to: email, // list of receivers
      subject: 'Välkommen till ' + config.name, // Subject line
      //text: 'http://' + config.url + '/login/voter/' + uid//, // plaintext body
      html: html1 + 'http://' + config.url + '/login/voter/' + uid + html2
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
          callback(uid);
      }
    });
};
