export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            admins: {
                Row: {
                    created_at: string
                    email: string
                    id: string
                    role: string | null
                }
                Insert: {
                    created_at?: string
                    email: string
                    id: string
                    role?: string | null
                }
                Update: {
                    created_at?: string
                    email?: string
                    id?: string
                    role?: string | null
                }
                Relationships: []
            }
            product_categories: {
                Row: {
                    code: string
                    created_at: string
                    id: string
                    name_en: string | null
                    name_ko: string
                }
                Insert: {
                    code: string
                    created_at?: string
                    id?: string
                    name_en?: string | null
                    name_ko: string
                }
                Update: {
                    code?: string
                    created_at?: string
                    id?: string
                    name_en?: string | null
                    name_ko?: string
                }
                Relationships: []
            }
            facilities: {
                Row: {
                    created_at: string
                    id: string
                    image_url: string | null
                    name_en: string | null
                    name_ko: string
                    specs: string | null
                    status: string | null
                    type: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    name_en?: string | null
                    name_ko: string
                    specs?: string | null
                    status?: string | null
                    type?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    name_en?: string | null
                    name_ko?: string
                    specs?: string | null
                    status?: string | null
                    type?: string | null
                }
                Relationships: []
            }
            history: {
                Row: {
                    content_en: string | null
                    content_ko: string
                    created_at: string
                    id: string
                    month: string
                    day: string | null
                    year: string
                }
                Insert: {
                    content_en?: string | null
                    content_ko: string
                    created_at?: string
                    id?: string
                    month: string
                    day?: string | null
                    year: string
                }
                Update: {
                    content_en?: string | null
                    content_ko?: string
                    created_at?: string
                    id?: string
                    month?: string
                    day?: string | null
                    year?: string
                }
                Relationships: []
            }
            notices: {
                Row: {
                    body_en: string | null
                    body_ko: string | null
                    category: string | null
                    created_at: string
                    id: string
                    image_url: string | null
                    is_pinned: boolean | null
                    published_at: string | null
                    status: string | null
                    title_en: string | null
                    title_ko: string
                    updated_at: string
                    views: number | null
                }
                Insert: {
                    body_en?: string | null
                    body_ko?: string | null
                    category?: string | null
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    is_pinned?: boolean | null
                    published_at?: string | null
                    status?: string | null
                    title_en?: string | null
                    title_ko: string
                    updated_at?: string
                    views?: number | null
                }
                Update: {
                    body_en?: string | null
                    body_ko?: string | null
                    category?: string | null
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    is_pinned?: boolean | null
                    published_at?: string | null
                    status?: string | null
                    title_en?: string | null
                    title_ko: string
                    updated_at?: string
                    views?: number | null
                }
                Relationships: []
            }
            partners: {
                Row: {
                    created_at: string
                    id: string
                    logo_url: string | null
                    name_en: string | null
                    name_ko: string
                    type: string | null
                    website_url: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    logo_url?: string | null
                    name_en?: string | null
                    name_ko: string
                    type?: string | null
                    website_url?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    logo_url?: string | null
                    name_en?: string | null
                    name_ko?: string
                    type?: string | null
                    website_url?: string | null
                }
                Relationships: []
            }
            product_notices: {
                Row: {
                    notice_id: string
                    product_id: string
                }
                Insert: {
                    notice_id: string
                    product_id: string
                }
                Update: {
                    notice_id?: string
                    product_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "product_notices_notice_id_fkey"
                        columns: ["notice_id"]
                        isOneToOne: false
                        referencedRelation: "notices"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "product_notices_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            products: {
                Row: {
                    capacity: string | null
                    category_code: string
                    created_at: string
                    desc_en: string | null
                    desc_ko: string | null
                    id: string
                    images: string[] | null
                    model_no: string | null
                    name_en: string
                    name_ko: string
                    partner_id: string | null
                    specs: Json | null
                    status: string | null
                    updated_at: string
                }
                Insert: {
                    capacity?: string | null
                    category_code: string
                    created_at?: string
                    desc_en?: string | null
                    desc_ko?: string | null
                    id?: string
                    images?: string[] | null
                    model_no?: string | null
                    name_en: string
                    name_ko: string
                    partner_id?: string | null
                    specs?: Json | null
                    status?: string | null
                    updated_at?: string
                }
                Update: {
                    capacity?: string | null
                    category_code?: string
                    created_at?: string
                    desc_en?: string | null
                    desc_ko?: string | null
                    id?: string
                    images?: string[] | null
                    model_no?: string | null
                    name_en?: string
                    name_ko?: string
                    partner_id?: string | null
                    specs?: Json | null
                    status?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_partner_id_fkey"
                        columns: ["partner_id"]
                        isOneToOne: false
                        referencedRelation: "partners"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "fk_products_category"
                        columns: ["category_code"]
                        isOneToOne: false
                        referencedRelation: "product_categories"
                        referencedColumns: ["code"]
                    }
                ]
            }
            product_partners: {
                Row: {
                    partner_id: string
                    product_id: string
                }
                Insert: {
                    partner_id: string
                    product_id: string
                }
                Update: {
                    partner_id?: string
                    product_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "product_partners_partner_id_fkey"
                        columns: ["partner_id"]
                        isOneToOne: false
                        referencedRelation: "partners"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "product_partners_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_admin: { Args: never; Returns: boolean }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}