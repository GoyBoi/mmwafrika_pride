# Image Organization Guide

## Directory Structure

```
public/images/
├── products/{category}/{slug}/{index}-{name}.webp
├── community/{descriptive-title}.webp
├── icons/{icon-name}.svg
└── placeholders/{type}/default.svg
```

## Naming Conventions

### Product Images
- **Format**: `{kebab-case-slug}/{2-digit-index}-{descriptive-name}.webp`
- **Examples**: `products/clothing/umuntu-cardigan/01-main.webp`

### Community Images
- **Format**: `{short-descriptive-title}.webp`

### Icons/Logos
- **Format**: `{descriptive-name}.svg`

## Image Specifications

### Product Images
| Type | Dimensions | Format | Max Size |
|------|-----------|--------|----------|
| Main product | 1200x1500px (4:5) | WebP/AVIF | < 200KB |
| Detail shots | 800x1000px (4:5) | WebP/AVIF | < 150KB |
| Lifestyle | 1200x800px (3:2) | WebP/AVIF | < 250KB |

### Hero Images
| Type | Dimensions | Format | Max Size |
|------|-----------|--------|----------|
| Desktop hero | 1920x1080px (16:9) | WebP/AVIF | < 300KB |
| Mobile hero | 750x1000px (3:4) | WebP/AVIF | < 200KB |

### Community Images
| Type | Dimensions | Format | Max Size |
|------|-----------|--------|----------|
| Gallery photo | 800x1200px (2:3) | WebP/AVIF | < 200KB |

## Migration Plan

1. **Current state**: Images hosted on `lh3.googleusercontent.com`
2. **Target state**: Local images in `public/images/` structure
3. **Action needed**: Download all referenced images from design HTML files, rename according to conventions, place in appropriate directories, update component `src` paths.
