import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import routes from '../../routes';
import AuthLayout from '../../components/auth/auth-layout';
import Button from '../../components/auth/button';
import Separator from '../../components/auth/separator';
import FormBox from '../../components/auth/form-box';
import BottomBox from '../../components/auth/bottom-box';
import { useForm, SubmitHandler } from 'react-hook-form';
import PageTitle from '../../components/page-title';
import { Input, IForm } from '../../components/shared';
import FormError from '../../components/auth/form-error';
import { gql, useMutation } from '@apollo/client';
import { logUserIn } from '../../apollo';
import { loginMutation, loginMutationVariables } from '../../__generated__/loginMutation';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const FacebookLogin = styled.div`
   color: #385285;
   cursor: pointer;

   span {
      margin-left: 10px;
      font-weight: 600;
   }
`;

const Notification = styled.div`
   margin-top: 10px;
   font-size: 12px;
   color: #2ecc71;
`;

const LOGIN_MUTATION = gql`
   mutation loginMutation($loginInput: LoginInput!) {
      login(input: $loginInput) {
         ok
         error
         token
      }
   }
`;

function Login() {
   const location = useLocation();
   const {
      register,
      handleSubmit,
      setError,
      clearErrors,
      formState: { errors, isValid },
   } = useForm<IForm>({
      mode: 'onChange',
      defaultValues: {
         email: location?.state?.email || '',
         password: location?.state?.password || '',
      },
   });
   console.log(location?.state);

   const onCompleted = (data: loginMutation) => {
      const {
         login: { ok, error, token },
      } = data;
      if (!ok) {
         if (error) {
            return setError('result', {
               message: error,
            });
         }
      }
      if (token) {
         toast.success(`Welcome to Nomad Insta`, {
            theme: 'light',
            draggable: true,
         });

         logUserIn(token);
      }
   };

   const [loginMutation, { loading }] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
      onCompleted,
   });
   const onValid: SubmitHandler<IForm> = ({ email, password }) => {
      if (loading) {
         return;
      }
      loginMutation({
         variables: {
            loginInput: {
               email,
               password,
            },
         },
      });
   };

   return (
      <AuthLayout>
         <PageTitle title='Login' />
         <FormBox>
            <div>
               <FontAwesomeIcon icon={faInstagram} size='3x' />
            </div>
            <Notification>{location?.state?.message}</Notification>
            <form onSubmit={handleSubmit(onValid)} onClick={() => clearErrors()}>
               <Input
                  type='text'
                  placeholder='Email'
                  {...register('email', {
                     required: '???????????? ???????????????.',
                     minLength: {
                        value: 5,
                        message: '???????????? 5??? ??????????????? ?????????.',
                     },
                     pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: '????????? ????????? ????????????.',
                     },
                  })}
                  hasError={Boolean(errors?.email?.message)}
               />
               <FormError message={errors?.email?.message} />
               <Input
                  type='password'
                  placeholder='Password'
                  {...register('password', {
                     required: '??????????????? ???????????????.',
                     minLength: {
                        value: 5,
                        message: '??????????????? 5??? ??????????????? ?????????.',
                     },
                     pattern: {
                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/,
                        message: '??? ?????????, ??????, ??????????????? ???????????? ?????????.',
                     },
                  })}
                  hasError={Boolean(errors?.password?.message)}
               />
               <FormError message={errors?.password?.message} />
               <Button type='submit' value={loading ? 'Loading...' : 'Log in'} disabled={!isValid || loading} />
               <FormError message={errors?.result?.message} />
            </form>
            <Separator>
               <div></div>
               <span>Or</span>
               <div></div>
            </Separator>
            <FacebookLogin>
               <FontAwesomeIcon icon={faFacebookSquare} />
               <span>Log in with Facebook</span>
            </FacebookLogin>
         </FormBox>
         <BottomBox cta={'Dont have an account?'} link={routes.signUp} linkText={'Sign up'} />
      </AuthLayout>
   );
}
export default Login;
