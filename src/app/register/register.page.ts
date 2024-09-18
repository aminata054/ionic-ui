import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  regForm!: FormGroup;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'match': true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async register() {
    if (this.regForm.valid) {
      const { email, password } = this.regForm.value;

      try {
        const res = await this.authService.signup({ email, password });

        if (res.user?.uid) {
          const data = {
            email: email,
            uid: res.user.uid,
            isAdmin: false
          };
          await this.authService.saveDetails(data);
          this.router.navigate(['/login']);
          // this.authService.sendEmailForValidation(res.user)
          // this.router.navigateByUrl(`/complete-profile/${data.uid}`);
        }
      } catch (error) {
        console.error(error);
        this.presentToast('Erreur inconnue');
      }
    } else {
      this.presentToast('Veuillez corriger les erreurs dans le formulaire.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      swipeGesture: 'vertical',
      position: 'bottom'
    });
    toast.present();
  }
}
