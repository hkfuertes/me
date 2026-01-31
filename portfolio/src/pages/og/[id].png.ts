import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { ImageResponse } from '@vercel/og';

interface OGImageOptions {
  title: string;
  type: 'blog' | 'project' | 'contribution';
}

async function generateOGImageBuffer({ title, type }: OGImageOptions): Promise<Buffer> {
  const accentColor = type === 'project' ? '#10b981' : '#6ee7b7';
  const typeLabel = type === 'project' ? 'PROJECT' : type === 'contribution' ? 'CONTRIBUTION' : 'WRITING';

  let fontSize = '80px';
  if (title.length > 80) fontSize = '48px';
  else if (title.length > 50) fontSize = '64px';

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
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '24px',
                        fontWeight: '600',
                        color: accentColor,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        border: `2px solid ${accentColor}`,
                        padding: '8px 16px',
                      },
                      children: typeLabel,
                    },
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize,
                    fontWeight: '700',
                    color: '#f3f4f6',
                    lineHeight: '1.2',
                    maxWidth: '90%',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '28px',
                          color: '#9ca3af',
                          fontWeight: '500',
                        },
                        children: 'Miguel Fuertes',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '48px',
                          height: '4px',
                          backgroundColor: accentColor,
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
  return Buffer.from(arrayBuffer);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const gists = await getCollection('gists');
  const githubRepos = await getCollection('githubRepos');
  
  // Solo generar OG images para:
  // - Todos los gists (tienen página de detalle)
  // - GitHub repos con README (showReadme: true, tienen página de detalle)
  const githubReposWithReadme = githubRepos.filter(repo => repo.data.showReadme === true);
  const allContent = [...gists, ...githubReposWithReadme];

  return allContent.map((item) => {
    const isGitHub = item.id.includes('-');
    const contentType = isGitHub ? 'project' : 'blog';

    // Determinar el título para la imagen OG (misma lógica que en [id].astro)
    let ogImageTitle = item.data.title;

    if (isGitHub) {
      if (item.data.description && item.data.description.length > 20) {
        ogImageTitle = item.data.description;
      } else {
        ogImageTitle = item.data.title
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }

    return {
      params: { id: item.id },
      props: {
        title: ogImageTitle,
        type: contentType,
      },
    };
  });
};

export const GET: APIRoute = async ({ props }) => {
  const { title, type } = props as { title: string; type: 'blog' | 'project' };

  const imageBuffer = await generateOGImageBuffer({ title, type });

  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
