-- Tables pour la nouvelle version 2026

CREATE TABLE matrice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  
  diagnostic_depth VARCHAR(20) NOT NULL, -- 'standard' or 'advanced'
  
  -- Raw answers
  core_answers JSONB NOT NULL,
  bonus_answers JSONB,
  
  -- Scoring Base
  axis_x NUMERIC NOT NULL,
  axis_y NUMERIC NOT NULL,
  certainty_score INTEGER NOT NULL,
  quadrant VARCHAR(50) NOT NULL,
  
  -- Variables
  revenue_proximity NUMERIC NOT NULL,
  speed_score NUMERIC NOT NULL,
  reliability_score NUMERIC NOT NULL,
  
  -- Scoring Advanced
  moat_tech NUMERIC,
  moat_data NUMERIC,
  moat_distribution NUMERIC,
  moat_global INTEGER,
  ia_vulnerability INTEGER,
  pain_point VARCHAR(50),
  
  -- AI Output
  diagnostic_json JSONB NOT NULL,
  scoring_debug JSONB
);

CREATE TABLE matrice_answer_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id UUID REFERENCES matrice_sessions(id) ON DELETE CASCADE,
  question_key VARCHAR(10) NOT NULL,
  answer_value VARCHAR(50) NOT NULL,
  is_bonus BOOLEAN DEFAULT false
);

-- Index pour performance
CREATE INDEX idx_matrice_sessions_email ON matrice_sessions(user_email);
CREATE INDEX idx_matrice_answer_events_session ON matrice_answer_events(session_id);
