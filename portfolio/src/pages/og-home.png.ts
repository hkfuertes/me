import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { SEO_CONFIG } from '@/data/seo';
import fs from 'fs';
import path from 'path';

/**
 * Static OG image for landing page
 * Shows: Name, title, contact info, profile photo following Swiss Design aesthetic
 */
export const GET: APIRoute = async () => {
  const { author, defaultDescription } = SEO_CONFIG;
  
  // Read profile image and convert to base64
  const profileImagePath = path.join(process.cwd(), 'public', 'images', 'profile.jpeg');
  const profileImageBuffer = fs.readFileSync(profileImagePath);
  const profileImageBase64 = `data:image/jpeg;base64,${profileImageBuffer.toString('base64')}`;
  
  const html = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#0f1114',
        padding: '80px',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
      },
      children: [
        // Grid background
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            },
          },
        },
        // Content
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              position: 'relative',
            },
            children: [
              // Top: Name + Profile Photo
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '40px',
                  },
                  children: [
                    // Name section
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '24px',
                          flex: '1',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: '72px',
                                fontWeight: '700',
                                color: '#f3f4f6',
                                lineHeight: '1',
                              },
                              children: author.name,
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                width: '64px',
                                height: '4px',
                                backgroundColor: '#6ee7b7',
                              },
                            },
                          },
                        ],
                      },
                    },
                    // Profile photo
                    {
                      type: 'img',
                      props: {
                        src: profileImageBase64,
                        style: {
                          width: '160px',
                          height: '160px',
                          objectFit: 'cover',
                          border: '3px solid #6ee7b7',
                        },
                      },
                    },
                  ],
                },
              },
              // Middle: Title & Bio
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '36px',
                          fontWeight: '500',
                          color: '#d1d5db',
                          lineHeight: '1.2',
                        },
                        children: 'Senior Software Engineer',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          fontWeight: '400',
                          color: '#9ca3af',
                          lineHeight: '1.5',
                          maxWidth: '80%',
                        },
                        children: defaultDescription,
                      },
                    },
                  ],
                },
              },
              // Bottom: Contact
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  },
                  children: [
                    // Contact info
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: '20px',
                                color: '#6ee7b7',
                                fontWeight: '500',
                              },
                              children: author.email,
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: '18px',
                                color: '#9ca3af',
                                fontWeight: '400',
                              },
                              children: `# github.com/${author.github}`,
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: '18px',
                                color: '#9ca3af',
                                fontWeight: '400',
                              },
                              children: `# linkedin.com/in/${author.github}`,
                            },
                          },
                        ],
                      },
                    },
                    // Green line at the bottom right
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '64px',
                          height: '4px',
                          backgroundColor: '#6ee7b7',
                          marginLeft: 'auto',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  const imageResponse = new ImageResponse(html, {
    width: 1200,
    height: 630,
  });

  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
