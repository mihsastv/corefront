import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  sub1: Subscription;
  form: FormGroup;
  accessDenied: boolean;
  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.accessDenied = false;
    this.form = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        //теперь вы можете зайти в систему
      } else if (params['accessDenied']) {
        //требуется авторизация
        this.accessDenied = true;
      }
    })
  }

  onSubmit() {
      this.form.disable()
      /*const user = {
        email: this.form.value.email,
        password: this.form.value.password,
      }*/
      this.sub1 = this.auth.login(this.form.value)
          .subscribe(
            (res) => {this.router.navigate(['/overview'])},
            () => {console.log('Error'),
                        this.form.enable()}
          )
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        //теперь вы можете зайти в систему
      } else if (params['accessDenied']) {
        //требуется авторизация
        this.accessDenied = true;
      }
    })
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe()
    }
  }

}
