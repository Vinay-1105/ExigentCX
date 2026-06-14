-- 1. Create the contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'NDA', 'Engagement Agreement', 'Advisory Agreement'
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Signature', -- 'Pending Signature', 'Signed', 'Under Review', 'Expired'
    expert_email VARCHAR(255) NOT NULL,
    expert_name VARCHAR(255),
    expert_title VARCHAR(255),
    expert_avatar VARCHAR(255),
    company_email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    company_logo VARCHAR(50),
    logo_color VARCHAR(100),
    value VARCHAR(100),
    duration VARCHAR(100),
    start_date VARCHAR(100),
    end_date VARCHAR(100),
    created_date VARCHAR(100),
    expires_at VARCHAR(100),
    signed_by_expert BOOLEAN DEFAULT FALSE,
    signed_by_company BOOLEAN DEFAULT FALSE,
    signature_expert VARCHAR(255),
    signature_company VARCHAR(255),
    signed_date VARCHAR(100),
    generated_by VARCHAR(255) DEFAULT 'ExigentCX Platform',
    pages INTEGER DEFAULT 1,
    file_size VARCHAR(50),
    urgency VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the contracts table
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for access control (using auth JWT claims)
CREATE POLICY "Users can view their own contracts" ON contracts
    FOR SELECT
    USING (
        auth.jwt() ->> 'email' = expert_email OR 
        auth.jwt() ->> 'email' = company_email
    );

CREATE POLICY "Users can sign their own contracts" ON contracts
    FOR UPDATE
    USING (
        auth.jwt() ->> 'email' = expert_email OR 
        auth.jwt() ->> 'email' = company_email
    )
    WITH CHECK (
        auth.jwt() ->> 'email' = expert_email OR 
        auth.jwt() ->> 'email' = company_email
    );

-- 4. Enable Supabase Realtime for the contracts table
ALTER PUBLICATION supabase_realtime ADD TABLE contracts;
