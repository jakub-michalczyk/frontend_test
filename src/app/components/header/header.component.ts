import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterService } from '../footer/services/footer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected personalData$: Observable<string | null>;
  private destroyRef = inject(DestroyRef);

  constructor(private footerService: FooterService) {
    this.personalData$ = this.footerService.personalData$.pipe(
      takeUntilDestroyed(this.destroyRef),
      map((data) => (!data ? '' : data))
    );
  }
}
