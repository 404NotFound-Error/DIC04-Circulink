export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          university: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          university: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          university?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          category_id: string;
          condition: 'excellent' | 'good' | 'fair' | 'poor';
          images: string[];
          seller_id: string;
          location: string;
          status: 'available' | 'sold' | 'reserved';
          tags: string[];
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          category_id: string;
          condition?: 'excellent' | 'good' | 'fair' | 'poor';
          images?: string[];
          seller_id: string;
          location: string;
          status?: 'available' | 'sold' | 'reserved';
          tags?: string[];
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          category_id?: string;
          condition?: 'excellent' | 'good' | 'fair' | 'poor';
          images?: string[];
          seller_id?: string;
          location?: string;
          status?: 'available' | 'sold' | 'reserved';
          tags?: string[];
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          item_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          item_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          item_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {
      increment_item_views: {
        Args: { item_uuid: string };
        Returns: void;
      };
    };
  };
}