export function GetResetPasswordMjmlTemplate(baseUrl: string): string {
  return `
<mjml>
  <mj-head>
    <mj-title>Your client platform is live!</mj-title>
    <mj-font name="Lato" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" />
    <mj-attributes>
      <mj-all font-family="Lato, helvetica, Arial, sans-serif"></mj-all>
    </mj-attributes>
    <mj-style>
      .body-background {
        background: linear-gradient(111.31deg, #4EA5C4 0%,
            #73BFB6 48.44%, #A9D8C1 100%);
        height: 100%;
        width: 100%;
      }
    </mj-style>
  </mj-head>
  <mj-body css-class="body-background">
    <mj-section>
      <mj-column>
        <mj-image width="100px" src="${baseUrl}/bambu-go-email-logo.png?v=2023-05-24-01"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section background-color="white" padding="40px 40px 0 40px">
      <mj-column width="100%" padding="0">
        <mj-text font-style="normal" font-weight="400" font-size="28px" line-height="36px" color="#444845" padding="0">
          Use the link below to reset your password
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="white" padding="24px 40px 0 40px">
      <mj-column width="100%" padding="0">
        <mj-button align="left" font-style="normal" font-weight="500" font-size="16px" line-height="24px" letter-spacing="0.15px" inner-padding="10px 24px" padding="0" background-color="#00876A" color="#FFFFFF" border-radius="2px" href="<%=url%>">
          Reset password
        </mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="white" padding="24px 40px 40px 40px">
      <mj-column width="100%" padding="0">
        <mj-text font-style="normal" font-weight="400" font-size="16px" line-height="24px" letter-spacing="0.5px" padding="0" color="#444845">
          This link is <strong>valid for one use only</strong>. It will expire in <strong><%=timeout%> minutes.</strong>
        </mj-text>
        <mj-text font-style="normal" font-weight="400" font-size="16px" line-height="24px" letter-spacing="0.5px" padding-top="16px" padding-left="0" padding-right="0" padding-bottom="0" color="#444845">
          If you didn't request this password reset, please disregard this email.
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-spacer height="50px"></mj-spacer>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
}
