import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {
  @Input() appImageFallback: string = '/assets/images/movie-placeholder.svg';
  private hasError = false;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    if (!this.hasError) {
      this.hasError = true;
      const imgElement = this.el.nativeElement;

      // Si el fallback también falla, crear un placeholder con SVG
      if (imgElement.src === this.appImageFallback) {
        this.createPlaceholder();
      } else {
        imgElement.src = this.appImageFallback;
      }
    }
  }

  @HostListener('load')
  onLoad(): void {
    this.hasError = false;
  }

  private createPlaceholder(): void {
    const imgElement = this.el.nativeElement;
    const parent = imgElement.parentElement;

    if (!parent) return;

    // Crear un div con SVG placeholder
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.backgroundColor = 'var(--muted)';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.color = 'var(--muted-foreground)';

    placeholder.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
    `;

    // Reemplazar imagen con placeholder
    parent.replaceChild(placeholder, imgElement);
  }
}
