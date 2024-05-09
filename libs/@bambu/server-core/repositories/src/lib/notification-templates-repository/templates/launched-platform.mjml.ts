export function GetLaunchedPlatformMjmlTemplate(baseUrl: string): string {
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
    <mj-section background-color="white" padding-top="40px">
      <mj-column width="100%" padding-bottom="0px" padding-left="40px" padding-right="40px" padding-bottom="0">
        <mj-text font-style="normal" font-weight="400" font-size="28px" line-height="36px" padding-top="0" color="#444845" padding-left="0" padding-right="0" padding-bottom="0">
          Here's the link that you can start sharing with your clients
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="white" padding-top="0">
      <mj-column width="100%" inner-background-color="#EFF1EE" padding-bottom="0px" padding-left="40px" padding-right="40px" border-radius="4px">
        <mj-text font-style="normal" font-weight="400" font-size="22px" line-height="28px" padding="16px" color="#444845">
          <a href="<%=url%>" style="color: #00876a; text-decoration: none"><%=url%></a>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="white" padding-top="0" padding-bottom="0">
      <mj-column width="100%" padding-left="40px" padding-right="40px" padding-bottom="0">
        <mj-text font-style="normal" font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.25px" padding-top="0" padding-bottom="22px" color="#444845" padding-left="0" padding-right="0">
          Need Help?
          <a href="mailto:<%=supportEmail%>" style="color: #00876a; text-decoration: none">Contact us
          </a>
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
