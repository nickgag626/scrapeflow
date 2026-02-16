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
  defaultSelectors?: { columnName: string; selector: string; dataType: string }[];
  defaultUrl?: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'amazon-products',
    name: 'Amazon Product Listings',
    description: 'Extract product names, prices, ratings, and images from Amazon search results',
    category: 'ecommerce',
    icon: '🛒',
    examples: ['Product Title', 'Price', 'Rating', 'Number of Reviews', 'Prime Eligible'],
    defaultSelectors: [
      { columnName: 'Title', selector: '[data-component-type="s-search-result"] h2 a span', dataType: 'text' },
      { columnName: 'Price', selector: '[data-component-type="s-search-result"] .a-price-whole', dataType: 'text' },
      { columnName: 'Rating', selector: '[data-component-type="s-search-result"] .a-icon-alt', dataType: 'text' }
    ],
    defaultUrl: 'https://www.amazon.com/s?k=products'
  },
  {
    id: 'zillow-listings',
    name: 'Zillow Real Estate',
    description: 'Scrape property listings with price, beds, baths, and square footage',
    category: 'realestate',
    icon: '🏠',
    examples: ['Price', 'Address', 'Beds', 'Baths', 'Sq Ft'],
    defaultSelectors: [
      { columnName: 'Price', selector: '[data-testid="price"]', dataType: 'text' },
      { columnName: 'Address', selector: '[data-testid="property-card-addr"]', dataType: 'text' },
      { columnName: 'Beds', selector: '[data-testid="bed-bath-item"]:first-child', dataType: 'text' }
    ],
    defaultUrl: 'https://www.zillow.com/homes/'
  },
  {
    id: 'linkedin-jobs',
    name: 'LinkedIn Job Posts',
    description: 'Collect job titles, companies, locations, and posting dates',
    category: 'jobs',
    icon: '💼',
    examples: ['Job Title', 'Company', 'Location', 'Posted Date', 'Applicants'],
    defaultSelectors: [
      { columnName: 'Title', selector: '.job-card-list__title', dataType: 'text' },
      { columnName: 'Company', selector: '.job-card-container__company-name', dataType: 'text' },
      { columnName: 'Location', selector: '.job-card-container__metadata-item', dataType: 'text' }
    ],
    defaultUrl: 'https://www.linkedin.com/jobs/'
  },
  {
    id: 'reddit-posts',
    name: 'Reddit Discussions',
    description: 'Extract post titles, upvotes, comments, and subreddit info',
    category: 'social',
    icon: '🗣️',
    examples: ['Title', 'Upvotes', 'Comments', 'Author', 'Subreddit'],
    defaultSelectors: [
      { columnName: 'Title', selector: '[data-testid="post-container"] h3', dataType: 'text' },
      { columnName: 'Upvotes', selector: '[data-testid="post-container"] [data-click-id="upvote"]', dataType: 'text' },
      { columnName: 'Comments', selector: '[data-testid="post-container"] [data-click-id="comments"]', dataType: 'text' }
    ],
    defaultUrl: 'https://www.reddit.com/'
  },
  {
    id: 'news-articles',
    name: 'News Headlines',
    description: 'Scrape news headlines, summaries, authors, and publish dates',
    category: 'news',
    icon: '📰',
    examples: ['Headline', 'Summary', 'Author', 'Published', 'Source'],
    defaultSelectors: [
      { columnName: 'Headline', selector: 'h2 a, h3 a, article h2', dataType: 'text' },
      { columnName: 'Summary', selector: 'article p, .summary, .excerpt', dataType: 'text' },
      { columnName: 'Author', selector: '.author, [rel="author"], .byline', dataType: 'text' }
    ],
    defaultUrl: 'https://news.ycombinator.com/'
  },
  {
    id: 'ebay-listings',
    name: 'eBay Products',
    description: 'Extract product info, current bid, buy it now price, and seller',
    category: 'ecommerce',
    icon: '🏷️',
    examples: ['Title', 'Current Price', 'Bids', 'Time Left', 'Seller'],
    defaultSelectors: [
      { columnName: 'Title', selector: '.s-item__title', dataType: 'text' },
      { columnName: 'Price', selector: '.s-item__price', dataType: 'text' },
      { columnName: 'Seller', selector: '.s-item__seller-info-text', dataType: 'text' }
    ],
    defaultUrl: 'https://www.ebay.com/sch/i.html'
  }
];

export { TEMPLATES };

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
