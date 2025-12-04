import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationService } from './services/confirmation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmationModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Frontend';

  constructor(public confirmationService: ConfirmationService) {}
}
