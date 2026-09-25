export interface KeyRect {
  x: number; // Center X relative to keyboard container
  y: number; // Center Y relative to keyboard container
  width: number;
  height: number;
  top: number;
  left: number;
}

class CoordinateRegistry {
  private keyElements: Map<string, HTMLElement> = new Map();
  private containerElement: HTMLElement | null = null;
  private keyRects: Map<string, KeyRect> = new Map();
  private listeners: Set<() => void> = new Set();

  public registerContainer(el: HTMLElement | null) {
    this.containerElement = el;
    this.recalculate();
  }

  public registerKey(code: string, el: HTMLElement | null) {
    if (el) {
      this.keyElements.set(code, el);
    } else {
      this.keyElements.delete(code);
    }
  }

  public recalculate() {
    if (!this.containerElement) return;
    const containerRect = this.containerElement.getBoundingClientRect();

    this.keyRects.clear();
    for (const [code, el] of this.keyElements.entries()) {
      const rect = el.getBoundingClientRect();
      const left = rect.left - containerRect.left;
      const top = rect.top - containerRect.top;
      this.keyRects.set(code, {
        x: left + rect.width / 2,
        y: top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        left,
        top,
      });
    }

    for (const listener of this.listeners) {
      listener();
    }
  }

  public getKeyRect(code: string): KeyRect | undefined {
    return this.keyRects.get(code);
  }

  public getContainerDimensions(): { width: number; height: number } {
    if (!this.containerElement) return { width: 900, height: 280 };
    return {
      width: this.containerElement.clientWidth,
      height: this.containerElement.clientHeight,
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const coordinateRegistry = new CoordinateRegistry();
