-- Create company_settings table
create table if not exists public.company_settings (
  id uuid default gen_random_uuid() primary key,
  -- Overview
  company_name_ko text,
  company_name_en text,
  ceo_name_ko text,
  ceo_name_en text,
  establishment_ko text,
  establishment_en text,
  employees_ko text,
  employees_en text,
  revenue_ko text,
  revenue_en text,
  address_ko text,
  address_en text,
  
  -- Mission
  mission_title_ko text,
  mission_title_en text,
  mission_desc_ko text,
  mission_desc_en text,
  
  -- Vision
  vision_title_ko text,
  vision_title_en text,
  vision_desc_ko text,
  vision_desc_en text,
  
  -- Core Values: array of { title_ko, title_en, desc_ko, desc_en, icon }
  core_values jsonb default '[]'::jsonb,
  
  -- CEO Message
  ceo_message_title_ko text,
  ceo_message_title_en text,
  ceo_message_content_ko text,
  ceo_message_content_en text,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.company_settings enable row level security;

-- Public Read Policy
create policy "Public can view company settings" on public.company_settings
  for select using (true);

-- Admin Manage Policy
create policy "Admins can manage company settings" on public.company_settings
  for all using (public.is_admin());

-- Insert Initial Row with default data (from ko.json/en.json)
insert into public.company_settings (
  company_name_ko, company_name_en,
  ceo_name_ko, ceo_name_en,
  establishment_ko, establishment_en,
  employees_ko, employees_en,
  revenue_ko, revenue_en,
  address_ko, address_en,
  mission_title_ko, mission_title_en,
  mission_desc_ko, mission_desc_en,
  vision_title_ko, vision_title_en,
  vision_desc_ko, vision_desc_en,
  core_values,
  ceo_message_title_ko, ceo_message_title_en,
  ceo_message_content_ko, ceo_message_content_en
) values (
  '대창기계산업(주)', 'Daechang Machinery Industry Co., Ltd.',
  '김주훈', 'Juhoon Kim',
  '2004년 3월', 'March 2004',
  '50명', '50 employees',
  '150억 원 (2024년 기준)', '15 billion KRW (as of 2024)',
  '경기 화성시 양감면 토성로 579-17', '579-17, Toseong-ro, Yanggam-myeon, Hwaseong-si, Gyeonggi-do, Korea',
  '미션', 'Mission',
  '혁신적인 기술로 고객의 가치를 창출하고, 인류의 풍요로운 삶에 기여합니다.', 'Creating customer value through innovative technology and contributing to the enrichment of human life.',
  '비전', 'Vision',
  'Global Top Tier 기계 산업 파트너', 'Global Top Tier Machinery Industry Partner',
  '[
    {
      "title_ko": "도전",
      "title_en": "Challenge",
      "desc_ko": "현실에 안주하지 않고 끊임없이 새로운 목표를 향해 나아갑니다.",
      "desc_en": "Constantly moving toward new goals without settling for reality.",
      "icon": "TrendingUp"
    },
    {
      "title_ko": "고객 중심",
      "title_en": "Customer Focus",
      "desc_ko": "모든 의사결정의 중심에 고객을 두고 최고의 가치를 제공합니다.",
      "desc_en": "Putting customers at the center of all decisions and providing the best value.",
      "icon": "Users"
    },
    {
      "title_ko": "신뢰",
      "title_en": "Trust",
      "desc_ko": "투명하고 정직한 경영으로 고객과 사회로부터 신뢰받는 기업이 됩니다.",
      "desc_en": "Becoming a company trusted by customers and society through transparent and honest management.",
      "icon": "Shield"
    }
  ]'::jsonb,
  'CEO 인사말', 'CEO Message',
  '안녕하십니까, 대창기계산업(주) 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다.\n\n저희 대창기계산업은 창립 이래 끊임없는 기술 혁신과 품질 향상을 통해 기계 산업의 발전에 기여해 왔습니다. 고객 여러분의 신뢰와 성원에 힘입어, 우리는 글로벌 시장에서도 경쟁력을 갖춘 기업으로 성장하고 있습니다.\n\n앞으로도 저희 임직원 모두는 ''고객 만족''을 최우선 가치로 삼고, 최고의 제품과 서비스를 제공하기 위해 최선을 다할 것을 약속드립니다. 지속 가능한 성장을 통해 사회적 책임을 다하고, 고객과 함께 발전하는 파트너가 되겠습니다.\n\n여러분의 변함없는 관심과 격려를 부탁드립니다.\n\n감사합니다.', 'Welcome to the official website of Daechang Machinery Industry Co., Ltd.\n\nSince our founding, we have contributed to the development of the machinery industry through constant technological innovation and quality improvement. Thanks to your trust and support, we are growing into a competitive company in the global market.\n\nAll of our employees promise to do our best to provide the best products and services, putting "customer satisfaction" as our top priority. We will fulfill our social responsibility through sustainable growth and become a partner that develops together with our customers.\n\nWe ask for your continued interest and encouragement.\n\nThank you.'
);
