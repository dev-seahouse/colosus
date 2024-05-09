// noinspection ES6PreferShortImport

/*
Reference Markup:<mjml>
  <mj-head>
    <mj-title>Schedule an appointment</mj-title>
    <mj-font name="Lato" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" />
    <mj-attributes>
      <mj-all font-family="Lato, helvetica, Arial, sans-serif"></mj-all>
    </mj-attributes>
    <mj-style>
      a {
      text-decoration: none;
      color: #00876A;
      }
      .header-section {
      min-height: 78px;
      }

      .advice-section {
      background-color: #F3FFF8;
      padding: 16px 16px 16px 16px;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.5px;
      color: #000000;
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section background-color="#F2F2F2" css-class="header-section">
      <mj-column>
        <mj-text align="center" color="#62DBB6" font-size="20px">WEALTH AVENUE</mj-text>
      </mj-column>
    </mj-section>
    <mj-section padding-bottom="0">
      <mj-column>
        <mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Hi [Investor name],</mj-text>
        <mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Thank you for your interest in scheduling an appointment. We’re eager to help you achieve your goal.</mj-text>
				<mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Rest assured, we will be contacting you shortly. Meanwhile, if you'd like to pursue different goals, feel free to revisit <a href="dummy.co">our platform</a>.</mj-text>
				<mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Didn’t see our scheduling platform? You can schedule a meeting with us <a href="dummy.co">here</a>.</mj-text>
				<mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Best regards,<br />
        [Agent name]<br />
        [Firm name]</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
*/

import mjml2html from 'mjml';
import * as tinyColour2Base from 'tinycolor2';
import { IScheduleAppointmentTemplateParametersDto } from '../i-schedule-appointment.parameters';

const tinyColour2 = tinyColour2Base.default;

export function GenerateScheduleAppointmentTemplate({
  logoUrl,
  brandColor,
  tradeName,
  agentName,
  headerBgColor,
  name,
  investorPortalUrl,
  contactLink,
}: IScheduleAppointmentTemplateParametersDto) {
  const headerElement = logoUrl
    ? `<mj-image width="300px"  src="<%= logoUrl %>" />`
    : `<mj-text align="center" color="<%= brandColor %>" font-size="20px"><%= tradeName %></mj-text>`;

  // const isBrandColorDark = tinyColour2(brandColor).isDark();
  // const baseBackgroundColor = '#F3FFF8';
  const backgroundColor = tinyColour2(brandColor).setAlpha(0.2).toHex8String();

  const ejsTemplate = mjml2html(`<mjml>
  <mj-head>
    <mj-title>Schedule an appointment</mj-title>
    <mj-font name="Lato" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" />
    <mj-attributes>
      <mj-all font-family="Lato, helvetica, Arial, sans-serif"></mj-all>
    </mj-attributes>
    <mj-style>
      a {
      text-decoration: none;
      color: #00876A;
      }
      .header-section {
        min-height: 78px;
      }
      .advice-section {
      background-color: ${backgroundColor};
      padding: 16px 16px 16px 16px;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.5px;
      color: #000000;
      }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section background-color="<%= headerBgColor %>" css-class="header-section">
      <mj-column width="100%">
        ${headerElement}
      </mj-column>
    </mj-section>
    <mj-section padding-bottom="0">
      <mj-column>
        <mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Hi <%= name %>,</mj-text>
        <mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Thank you for your interest in scheduling an appointment. We’re eager to help you achieve your goal.</mj-text>
				<mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Rest assured, we will be contacting you shortly. Meanwhile, if you'd like to pursue different goals, feel free to revisit <a href="<%= investorPortalUrl %>">our platform</a>.</mj-text>
				<mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Didn’t see our scheduling platform? You can schedule a meeting with us <a href="<%= contactLink %>">here</a>.</mj-text>
				<mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Best regards,<br />
        <%= agentName %><br />
        <%= tradeName %></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html;
  return {
    ejsTemplate,
    ejsParameters: {
      logoUrl,
      brandColor,
      tradeName,
      agentName,
      headerBgColor,
      name,
      investorPortalUrl,
      contactLink,
    } as ejs.Data,
  };
}
