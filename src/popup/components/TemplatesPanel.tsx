import { useState } from 'react';

interface TemplatesPanelProps {
  onSelect: (templateId: string) => void;
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'realestate' | 'jobs' | 'social' | 'news';
  icon: string;
  examples: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'amazon-products',
    name: 'Amazon Product Listings',
    description: 'Extract product names, prices, ratings, and images from Amazon search results',
    category: 'ecommerce',
    icon: '🛒',
    examples: ['Product Title', 'Price', 'Rating', 'Number of Reviews', 'Prime Eligible']
  },
  {
    id: 'zillow-listings',
    name: 'Zillow Real Estate',
    description: 'Scrape property listings with price, beds, baths, and square footage',
    category: 'realestate',
    icon: '🏠',
    examples: ['Price', 'Address', 'Beds', 'Baths', 'Sq Ft']
  },
  {
    id: 'linkedin-jobs',
    name: 'LinkedIn Job Posts',
    description: 'Collect job titles, companies, locations, and posting dates',
    category: 'jobs',
    icon: '💼',
    examples: ['Job Title', 'Company', 'Location', 'Posted Date', 'Applicants']
  },
  {
    id: 'reddit-posts',
    name: 'Reddit Discussions',
    description: 'Extract post titles, upvotes, comments, and subreddit info',
    category: 'social',
    icon: '🗣️',
    examples: ['Title', 'Upvotes', 'Comments', 'Author', 'Subreddit']
  },
  {
    id: 'news-articles',
    name: 'News Headlines',
    description: 'Scrape news headlines, summaries, authors, and publish dates',
    category: 'news',
    icon: '📰',
    examples: ['Headline', 'Summary', 'Author', 'Published', 'Source']
  },
  {
    id: 'ebay-listings',
    name: 'eBay Products',
    description: 'Extract product info, current bid, buy it now price, and seller',
    category: 'ecommerce',
    icon: '🏷️',
    examples: ['Title', 'Current Price', 'Bids', 'Time Left', 'Seller']
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: '📋' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛒' },
  { id: 'realestate', name: 'Real Estate', icon: '🏠' },
  { id: 'jobs', name: 'Jobs', icon: '💼' },
  { id: 'social', name: 'Social', icon: '🗣️' },
  { id: 'news', name: 'News', icon: '📰' },
];

export function TemplatesPanel({ onSelect, onBack }: TemplatesPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = selectedCategory === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="editor">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <h2 style={{ margin: 0, fontSize: '16px' }}>Templates</h2>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        marginBottom: '16px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ 
              fontSize: '12px', 
              padding: '6px 12px',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="config-card"
            onClick={() => onSelect(template.id)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ fontSize: '32px' }}>{template.icon}</div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                  {template.name}
                </div>
                
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                  {template.description}
                </div>
                
                {hoveredTemplate === template.id && (
                  <div style={{ 
                    background: '#0f172a', 
                    padding: '8px 12px', 
                    borderRadius: '6px',
                    marginTop: '8px'
                  }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                      Columns included:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {template.examples.map(ex => (
                        <span 
                          key={ex}
                          style={{
                            background: '#1e293b',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#e2e8f0'
                          }}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ 
                background: '#3b82f6', 
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                Use →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
