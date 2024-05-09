import mjml2html from 'mjml';
import { IGenerateMjmlTemplateForSendingToWKParams } from '../i-wk-update-bank-account.parameters';

function GetWealthKernelUpdateAdvisorBankAccountDetialsMjml(
  baseUrl: string
): string {
  return `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image width="100px" src="${baseUrl}/bambu-go-email-logo.png"></mj-image>
        <mj-divider border-color="#00876A"></mj-divider>

        <mj-text font-size="14px" color="#000" font-family="helvetica">Hello, Wealth Kernel Team!</mj-text>

        <mj-text font-size="14px" padding-top="10px">
          Please find the bank account details for the bambu tenant advisor
        </mj-text>

        <mj-section>
          <mj-column>
            <mj-table font-size="14px">
              <tr style="text-align:left;padding:15px 0;">
                <th style="padding: 0 15px 10px 0;">Tenant Email </th>
                <td style="padding: 0 15px ;"><%=tenantEmail%></td>
              </tr>
              <tr style="text-align:left;padding:15px 0;">
                <th style="padding: 0 15px 10px 0;">Tenant ID </th>
                <td style="padding: 0 15px ;"><%=tenantId%></td>
              </tr>
              <tr style="text-align:left;padding:15px 0;">
                <th style="padding: 0 15px 10px 0;">Account Name</th>
                <td style="padding: 10px 15px;"><%=accountName%></td>
              </tr>
              <tr style="text-align:left;padding:15px 0;">
                <th style="padding: 0 15px 10px 0;">Account Number</th>
                <td style="padding: 0 15px;"><%=accountNumber%></td>

              </tr>
              <tr style="text-align:left;padding:15px 0;">
                <th style="padding: 0 15px 10px 0;">Sort Code</th>
                <td style="padding: 0 15px;"><%=sortCode%></td>
              </tr>
              <tr style="text-align:left;padding:15px 0;">
                <th style="padding: 0 15px 10px 0;">Annual Mangement Fee</th>
                <td style="padding: 0 15px ;"><%=annualManagementFee%>%</td>
              </tr>

            </mj-table>
          </mj-column>
        </mj-section>
      </mj-column>
    </mj-section>

  </mj-body>
</mjml>`;
}

export function GenerateMjmlTemplateForSendingToWealthKernel(
  input: IGenerateMjmlTemplateForSendingToWKParams,
  baseUrl: string
) {
  const mjmlParsingResult = mjml2html(
    GetWealthKernelUpdateAdvisorBankAccountDetialsMjml(baseUrl)
  );

  const ejsParameters = {
    tenantId: input.tenantId,
    tenantEmail: input.tenantEmail,
    accountName: input.accountName,
    accountNumber: input.accountNumber,
    sortCode: input.sortCode,
    annualManagementFee: input.annualManagementFee,
  } as ejs.Data;

  return { ejsTemplate: mjmlParsingResult.html, ejsParameters };
}
