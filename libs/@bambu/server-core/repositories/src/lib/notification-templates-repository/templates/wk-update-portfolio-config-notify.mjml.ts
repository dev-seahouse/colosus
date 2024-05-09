import mjml2html from 'mjml';
import {
  IGenerateMJMLTemplateForUpdatePortfolioDataWKParams,
  IModelPortfolioDetailsForWKEmailDto,
  IModelPortfolioDetaislForWKEmailDto,
} from '../i-wk-update-portfolio-data.parameters.dto';

function GetWealthKernelUpdatePortfolioConfigMjml(
  baseUrl: string,
  modelPortfolioDetails: IModelPortfolioDetailsForWKEmailDto,
  payload: IModelPortfolioDetaislForWKEmailDto[]
): string {
  // Generate Header Rows with model portfolio details
  const modelPortfolioDetailsTable = `<mj-table padding-top="10px">
  <tr style="border-bottom:1px solid #ecedee; text-align:left; padding: 0 15px 0 0;">
    <th style="white-space: nowrap; padding: 0 15px 0 0;">Client Reference</th>
    <td style="padding: 0 15px;">${modelPortfolioDetails.id}</td>

  </tr>
  <tr style="border-bottom:1px solid #ecedee; text-align:left; padding: 0 15px 0 0;">
    <th style="padding: 0 15px 0 0;">Name</th>
    <td style="padding: 0 15px;">${modelPortfolioDetails.name}</td>

  </tr>

  <tr style="border-bottom:1px solid #ecedee; text-align:left; padding: 0 15px 0 0;">
    <th style="white-space: nowrap; padding: 0 15px 0 0;">Description</th>
    <td style="padding: 0 15px;">${modelPortfolioDetails.description}</td>
    </td>
  </tr>

</mj-table>`;

  // Generate Instruments and Weightage rows
  const instrumentDistribution = payload.map((instrument) => {
    return `<tr style="border:1px solid #ecedee;text-align:left;">
  <td>${instrument.isin}</td>
  <td>${instrument.weightage}</td>
</tr>`;
  });

  return `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image width="100px" src="${baseUrl}/bambu-go-email-logo.png"></mj-image>
        <mj-divider border-color="#00876A"></mj-divider>

        <mj-text font-size="14px" color="#000" font-family="helvetica">Hello, Wealth Kernel Team!</mj-text>

        <mj-text font-size="14px" padding-top="10px">
          Please find the updated portfolio data for tenant <%=tenantEmail%>
        </mj-text>
          ${modelPortfolioDetailsTable}
        <mj-table>
          <tr style="border:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th>Components</th>
            <td></td>
          </tr>
          <tr style="border:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th>ISIN</th>
            <th>Weight</th>
          </tr>

          ${instrumentDistribution.join('')}

          <tr style="border:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th>Total</th>
            <th>1</th>
          </tr>
          <tr style="border:1px solid #ecedee;text-align:left;">
            <th>Expected Model Update Frequency</th>
            <th>Quarterly</th>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
}

export function GenerateMjmlTemplateForSendingPortfolioConfigToWK(
  baseUrl: string,
  input: IGenerateMJMLTemplateForUpdatePortfolioDataWKParams
) {
  const mjmlParsingResult = mjml2html(
    GetWealthKernelUpdatePortfolioConfigMjml(
      baseUrl,
      input.modelPortfolioDetails,
      input.payload
    )
  );

  const ejsParameters = {
    tenantEmail: input.tenantEmail,
    modelPortfolioId: input.modelPortfolioDetails.id,
    modelPortfolioName: input.modelPortfolioDetails.name,
    modelPortfolioDescription: input.modelPortfolioDetails.description,
    payload: input.payload,
  } as ejs.Data;

  return { ejsTemplate: mjmlParsingResult.html, ejsParameters };
}
