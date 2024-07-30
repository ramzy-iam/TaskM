import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixMagnifyingGlass, radixCross2 } from '@ng-icons/radix-icons';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input-search',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideIcons({
      radixMagnifyingGlass,
      radixCross2,
    }),
  ],
  templateUrl: './input-search.component.html',
})
export class InputSearchComponent implements OnInit {
  @Input() control?: FormControl | null;
  @Input() attributes: Record<string, string> = {}; // Input for additional attributes

  isEmpty: boolean = true;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl('');
    }
    this.isEmpty = !this.control.value;
    this.control.valueChanges.subscribe((value) => {
      this.isEmpty = !value;
    });

    // Apply attributes to the input element after initialization
    this.applyAttributes();
  }

  ngOnChanges() {
    this.applyAttributes();
  }

  private applyAttributes() {
    const inputElement = this.elRef.nativeElement.querySelector('input');
    if (inputElement) {
      // Remove all attributes to ensure only the latest ones are applied
      Object.keys(this.attributes).forEach((attr) => {
        this.renderer.removeAttribute(inputElement, attr);
      });
      // Apply new attributes
      Object.entries(this.attributes).forEach(([key, value]) => {
        this.renderer.setAttribute(inputElement, key, value);
      });
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isEmpty = !input.value;
  }

  onIconClick() {
    if (!this.isEmpty) {
      this.control?.setValue('');
    }
  }
}
