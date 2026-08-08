import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const signupSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { user, loading: authLoading, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values: SignupValues) => {
    setError(null);
    setSubmitting(true);

    const { error: signUpError } = await signUp(values.email, values.password);
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    navigate('/dashboard');
  };

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError.message);
      setSubmitting(false);
    }
    // On success, Supabase redirects away from the app.
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Helmet>
        <title>Sign up — GadgetSurge</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Sign up' }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Sign up</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Sign up with email or continue with Google.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        disabled={submitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        disabled={submitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          </Form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={submitting}
          >
            Continue with Google
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
