interface WeeklyData {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

interface YearlyData {
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
}

interface StatisticUserData {
  user_created_count: number;
  users_created_today: number;
  users_created_yesterday: number;
  week: WeeklyData;
  year: YearlyData;
}

interface StatisticJobData {
  job_created_count: number;
  jobs_created_today: number;
  jobs_created_yesterday: number;
  week: WeeklyData;
  year: YearlyData;
}

interface StatisticCompanyData {
  company_created_count: number;
  companies_created_today: number;
  companies_created_yesterday: number;
  week: WeeklyData;
  year: YearlyData;
}

interface Statistics {
  user_statistics: StatisticUserData;
  job_statistics: StatisticJobData;
  company_statistics: StatisticCompanyData;
}
