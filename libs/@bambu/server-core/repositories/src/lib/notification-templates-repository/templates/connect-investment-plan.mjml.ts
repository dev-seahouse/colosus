/*
Reference Markup:
<mjml>
  <mj-head>
    <mj-title>Verify your login</mj-title>
    <mj-font name="Lato" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" />
    <mj-attributes>
      <mj-all font-family="Lato, helvetica, Arial, sans-serif"></mj-all>
    </mj-attributes>
    <mj-style>
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
        <mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Hi David</mj-text>
        <mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Here’s a copy of your financial plan:</mj-text>
        <mj-text font-weight="400" font-size="22px" line-height="28px">Retire Comfortably</mj-text>
      </mj-column>
    </mj-section>
    <mj-section padding-top="0px" padding-bottom="0px">
      <mj-column>
        <mj-text background-color="#F3FFF8">
          <div class="advice-section">
            Invest <b>$950/mo</b> until you’re <b>65</b> and you’re likely to achieve your goal of <b>$1,200,000</b>
          </div>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section padding-top="16px" padding-bottom="0px">
      <mj-column width="100%">
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.5px">
          Projected return
        </mj-text>
      </mj-column>
      <mj-column width="100%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Estimated Return
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          $1,200,000
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Unfavourable Market
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          $977,000
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Favourable Market
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          $1,320,000
        </mj-text>
      </mj-column>
      <mj-column width="100%">
        <mj-text font-weight="700" font-size="10px" line-height="16px" letter-spacing="0.4px" color="#494949">
          <b>Disclaimer:</b> The results and/or estimates generated by this platform are based on the information provided by you and is intended to be used for illustrative purposes only. This platform is not intended to provide specific investment objectives, your financial situation, and particular needs. No guarantee is made as to its accuracy.
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
    	<mj-column width="100%">
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.5px">
          Balanced Portfolio
        </mj-text>
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.25px">
          This portfolio is suitable for investors who are seeking average returns and are ready to tolerate some price fluctuations. It has a mid to long-term investment time horizon.
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Expected return
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          5%
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Expected volatility
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          11%
        </mj-text>
      </mj-column>
      <mj-column width="100%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Asset Allocation
        </mj-text>
        <mj-text font-weight="399" font-size="16px" line-height="24px" letter-spacing="0.15px">
          <b>25%</b> Equity, <b>55%</b> Bonds, <b>20%</b> Money markets
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
*/

import { GoalTypes } from '@bambu/server-core/db/central-db';
import * as tinyColour2Base from 'tinycolor2';
import { ISendInvestmentPlanToLeadParametersDto } from '../i-send-investment-plan-to-lead-parameters.dto';
import mjml2html from 'mjml';
import * as _ from 'lodash';

const tinyColour2 = tinyColour2Base.default;

interface GetConnectInvestmentPlanMjmlInputDto {
  logoUrl: string | null;
  goalType: GoalTypes;
  recommendedMonthlyContribution: string;
  brandColor: string;
}

function GetConnectInvestmentPlanMjml({
  logoUrl,
  recommendedMonthlyContribution,
  brandColor,
}: GetConnectInvestmentPlanMjmlInputDto): string {
  const headerElement = logoUrl
    ? `<mj-image width="300px"  src="<%= logoUrl %>" />`
    : `<mj-text align="center" color="<%= brandColor %>" font-size="20px"><%= tradeName %></mj-text>`;

  // const adviceSectionCopy =
  // 'Invest <b><%= monthlyContribution %>/mo</b> until <b><%= goalEndYear %></b> and you’re likely to achieve your goal of <b><%= goalValue %></b>';

  // if (goalType === GoalTypes.RETIREMENT) {
  //   adviceSectionCopy =
  //     'Invest <b><%=monthlyContribution%>/mo</b> until you’re <b><%=retirementAge%></b> and you’re likely to achieve your goal of <b><%=goalValue%></b>';
  // }

  // if (goalType === GoalTypes.GROWING_WEALTH) {
  //   adviceSectionCopy =
  //     'Your investment of <b><%= initialInvestment %></b> has the potential to grow to <b><%= goalValue %></b>';
  // }

  const adviceSectionCopy =
    recommendedMonthlyContribution !== '0'
      ? `You’re likely to achieve your goal of <b><%=goalValue%></b> over <b><%=goalTimeFrame%></b> years if your monthly contribution is at least <%=recommendedMonthlyContribution%>/mo`
      : `You’re likely to achieve this goal based on this contribution plan`;

  // const isBrandColorDark = tinyColour2(brandColor).isDark();
  // const baseBackgroundColor = '#F3FFF8';
  const backgroundColor = tinyColour2(brandColor).setAlpha(0.2).toHex8String();

  return `<mjml>
  <mj-head>
    <mj-title>Your financial plan is ready</mj-title>
    <mj-font name="Lato" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" />
    <mj-attributes>
      <mj-all font-family="Lato, helvetica, Arial, sans-serif"></mj-all>
    </mj-attributes>
    <mj-style>
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
        <mj-text font-weight="500" font-size="14px" line-height="20px" letter-spacing="0.1px">Here’s a copy of your financial plan:</mj-text>
        <mj-text font-weight="400" font-size="16px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">Your goal</mj-text>
        <mj-text font-weight="400" font-size="22px" line-height="28px"><%= goalDescription %></mj-text>
      </mj-column>
    </mj-section>

      <mj-section padding-top="16px" padding-bottom="0px">
      <mj-column width="50%">
      <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
        Target amount
      </mj-text>
      <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
        <%= goalValue %>
      </mj-text>
    </mj-column>
    <mj-column width="50%">
      <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
        Timeframe
      </mj-text>
      <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
        <%= goalTimeFrame %> Years
      </mj-text>
    </mj-column>
    <mj-column width="50%">
      <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
        Initial Contribution
      </mj-text>
      <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
        <%=initialContribution%>
      </mj-text>
    </mj-column>
    <mj-column width="50%">
      <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
        Monthly Contribution
      </mj-text>
      <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
        <%=monthlyContribution%>
      </mj-text>
    </mj-column>
    <mj-divider border-width="1px" border-color="#8C8C8C"></mj-divider>
    </mj-section>
    <mj-section padding-top="16px" padding-bottom="0px">
      <mj-column width="100%">
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.5px">
          Projected return
        </mj-text>
        <mj-text font-weight="500" font-size="14px" line-height="0px" padding-top="0px">
          (after <%= goalTimeFrame%> years)
        </mj-text>
      </mj-column>
      <mj-column width="100%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Estimated value
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          <%=estimatedReturn%>
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          If markets perform worse
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          <%=unfavourableMarketReturn%>
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
        If markets perform better
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          <%=favourableMarketReturn%>
        </mj-text>
      </mj-column>

      <mj-section padding-top="0px" padding-bottom="0px">
      <mj-column>
        <mj-text>
          <div class="advice-section">
            ${adviceSectionCopy}
          </div>
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section>
    <mj-column width="100%">
      <mj-text font-weight="500" font-size="12px" line-height="16px" letter-spacing="0.4px" color="#8c8c8c">
        <b>Disclaimer:</b> The results and/or estimates generated by this platform are based on the information provided by you and is intended to be used for illustrative purposes only. This platform is not intended to provide specific investment objectives, your financial situation, and particular needs. No guarantee is made as to its accuracy.
      </mj-text>
    </mj-column>
  </mj-section>

    <mj-section>
    <mj-column width="100%">
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.5px">
          <%=portfolioName%>
        </mj-text>
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.25px">
          <%=portfolioDescription%>
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Expected return
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          <%=portfolioExpectedReturn%>
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Expected volatility
        </mj-text>
        <mj-text font-weight="700" font-size="16px" line-height="24px" letter-spacing="0.15px">
          <%=portfolioExpectedVolatility%>
        </mj-text>
      </mj-column>
      <mj-column width="100%">
      <mj-text font-weight="400" font-size="14px" line-height="20px" letter-spacing="0.1px" color="#8C8C8C" padding-bottom="0px">
          Asset Allocation
        </mj-text>
        <mj-text font-weight="399" font-size="16px" line-height="24px" letter-spacing="0.15px">
          <%- portfolioAssetAllocation %>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
}

export interface IGenerateMjmlTemplateForSendingInvestmentPlanToLeadParams {
  input: ISendInvestmentPlanToLeadParametersDto;
  goalType: GoalTypes;
}

export function GenerateMjmlTemplateForSendingInvestmentPlanToLead({
  input,
  goalType,
}: IGenerateMjmlTemplateForSendingInvestmentPlanToLeadParams) {
  const mjmlParsingResult = mjml2html(
    GetConnectInvestmentPlanMjml({
      logoUrl: input.branding.logoUrl,
      goalType,
      recommendedMonthlyContribution: `${input.lead.recommendedMonthlyContribution?.toLocaleString(
        'en'
      )}`,
      brandColor: input.branding.brandColor,
    })
  );

  const retirementAge = input.lead.age + input.lead.goalTimeframe;

  const goalEndYear = new Date().getFullYear() + input.lead.goalTimeframe;

  const portfolioAssetAllocation = _.chain(input.portfolioAssetDistribution)
    .orderBy(['percentageInInteger', 'type'], ['desc', 'asc'])
    .map((x) => `<b>${x.percentageInInteger}%</b> ${x.type}`)
    .join(', ')
    .value();

  const ejsParameters = {
    goalValue: `$${input.lead.goalValue.toLocaleString('en', {
      maximumFractionDigits: 0,
    })}`,
    estimatedReturn: `$${input.lead.projectedReturns.target.toLocaleString(
      'en',
      { maximumFractionDigits: 0 }
    )}`,
    unfavourableMarketReturn: `$${input.lead.projectedReturns.low.toLocaleString(
      'en',
      { maximumFractionDigits: 0 }
    )}`,
    favourableMarketReturn: `$${input.lead.projectedReturns.high.toLocaleString(
      'en',
      { maximumFractionDigits: 0 }
    )}`,
    goalTimeFrame: `${input.lead.goalTimeframe.toLocaleString('en')}`,
    initialContribution: `$${input.lead.initialInvestment.toLocaleString(
      'en'
    )}`,
    portfolioName: input.portfolioName,
    portfolioDescription: input.portfolioDescription,
    portfolioExpectedReturn: `${input.portfolioExpectedReturn}%`,
    portfolioExpectedVolatility: `${input.portfolioExpectedVolatility}%`,
    portfolioAssetAllocation,
    name: input.lead.name,
    logoUrl: input.branding.logoUrl,
    brandColor: input.branding.brandColor,
    tradeName: input.branding.tradeName.toUpperCase(),
    headerBgColor: input.branding.headerBgColor,
    monthlyContribution: `$${input.lead.monthlyContribution.toLocaleString(
      'en'
    )}`,
    recommendedMonthlyContribution: `$${input.lead.recommendedMonthlyContribution?.toLocaleString(
      'en'
    )}`,
    retirementAge,
    goalEndYear,
    initialInvestment: `$${input.lead.initialInvestment.toLocaleString('en')}`,
    goalDescription: input.lead.goalDescription,
    adviceTextColor: input.branding.brandColor,
  } as ejs.Data;

  return { ejsTemplate: mjmlParsingResult.html, ejsParameters };
}