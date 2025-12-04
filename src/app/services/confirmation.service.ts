import { Injectable, signal } from '@angular/core';
import { ConfirmationModalConfig } from '../shared/components/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private showModal = signal(false);
  private modalConfig = signal<ConfirmationModalConfig>({
    title: 'Confirmar acción',
    message: '¿Estás seguro?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'info',
    icon: 'help_outline'
  });

  private resolvePromise?: (value: boolean) => void;

  getShowModal = () => this.showModal();
  getModalConfig = () => this.modalConfig();

  confirm(config: Partial<ConfirmationModalConfig>): Promise<boolean> {
    const fullConfig: ConfirmationModalConfig = {
      title: config.title || 'Confirmar acción',
      message: config.message || '¿Estás seguro de que deseas continuar?',
      confirmText: config.confirmText || 'Confirmar',
      cancelText: config.cancelText || 'Cancelar',
      type: config.type || 'info',
      icon: config.icon || this.getDefaultIcon(config.type || 'info')
    };

    this.modalConfig.set(fullConfig);
    this.showModal.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  handleConfirm(): void {
    this.showModal.set(false);
    if (this.resolvePromise) {
      this.resolvePromise(true);
      this.resolvePromise = undefined;
    }
  }

  handleCancel(): void {
    this.showModal.set(false);
    if (this.resolvePromise) {
      this.resolvePromise(false);
      this.resolvePromise = undefined;
    }
  }

  private getDefaultIcon(type: string): string {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      case 'success':
        return 'check_circle';
      default:
        return 'help_outline';
    }
  }
}
