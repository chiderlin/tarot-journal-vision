import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2 } from 'lucide-react';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        // Check if user is already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/');
            }
        });
    }, [navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // For email confirmation flows, you might want to show a message here
                // But for now let's assume auto-confirm or just error check
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDevLogin = async () => {
        setLoading(true);
        try {
            const email = 'tarot_dev@test.com';
            const password = 'dev_password_123';

            // Try to sign in first
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                // Check if the error is "Invalid login credentials" (user might not exist)
                if (signInError.message.includes("Invalid login credentials")) {
                     // Try to sign up
                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                        email,
                        password,
                    });
                    
                    if (signUpError) {
                        toast.error(`Sign up failed: ${signUpError.message}`);
                    } else if (signUpData.session) {
                        toast.success('Developer account created and logged in!');
                        navigate('/'); 
                    } else if (signUpData.user && !signUpData.session) {
                         // User created but session is null -> likely email confirmation required
                         toast.warning('Developer account created, but email confirmation is required. Please check your email or disable "Confirm Email" in your Supabase project settings.');
                    }
                } else {
                    // Some other error (e.g., Email not confirmed)
                    toast.error(`Login failed: ${signInError.message}`);
                }
            } else if (signInData.session) {
                toast.success('Developer logged in!');
                navigate('/');
            }
        } catch (error: any) {
            toast.error(`Unexpected error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen simple-bg flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <Sparkles className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {isSignUp ? t('auth.createAccount') : t('auth.welcomeBack')}
                    </CardTitle>
                    <CardDescription>
                        {isSignUp ? t('auth.signUpDescription') : t('auth.signInDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('auth.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('auth.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6} // Added minLength as per instruction's implied change
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : isSignUp ? (
                                t('auth.signUp')
                            ) : (
                                t('auth.signIn')
                            )}
                        </Button>
                    </form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleDevLogin}
                        disabled={loading}
                    >
                        ⚡️ Developer Quick Login
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        variant="link"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-muted-foreground"
                    >
                        {isSignUp
                            ? t('auth.alreadyHaveAccount')
                            : t('auth.dontHaveAccount')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Auth;
