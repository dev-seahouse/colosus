export enum HttpUrlTypeEnum {
  SYSTEM = 'SYSTEM',
  CLIENT_CNAME = 'CLIENT_CNAME',
}

export enum SubscriptionStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SubscriptionProviderEnum {
  STRIPE = 'STRIPE',
}

export enum GoalTypes {
  RETIREMENT = 'Retirement',
  HOUSE = 'House',
  EDUCATION = 'Education',
  GROWING_WEALTH = 'Growing Wealth',
  OTHER = 'Other',
}

export enum QuestionnaireTypeEnum {
  RISK_PROFILING_QUESTIONNAIRE = 'RISK_PROFILING',
}

export enum ScoringRulesEnum {
  SCORING_RULES_MIN = 'MIN',
  SCORING_RULES_MAX = 'MAX',
  SCORING_RULES_AVG = 'AVG',
}

export enum QuestionFormatEnum {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  NUMERIC_ENTRY = 'NUMERIC_ENTRY',
}
