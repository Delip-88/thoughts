'use client'

import React, { useEffect, useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import FETCH_POSTS from '@/graphql/postsGql'
import { ClipLoader} from 'react-spinners'

const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary',
  }
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2 transition-all duration-200 ease-in-out transform hover:scale-105`}
      {...props}>
      {children}
    </button>
  );
}

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out ${className}`}
      ref={ref}
      {...props} />
  );
});
Input.displayName = 'Input'

export function BlogLandingPageJsx() {
  const [posts, SetPosts] = useState([]);
  const { data: { posts: fetchedPosts } = {}, error, loading } = useQuery(FETCH_POSTS);

  useEffect(() => {
    let fPosts = fetchedPosts
    if (fPosts) {
      fPosts = fPosts.map(post => {
        const date = new Date(Number(post.createdAt));
    
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          console.error("Invalid date for post:", post);
          return { ...post, createdAt: "Invalid Date" };  // Handle invalid date
        }
    
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const newTimeString = new Intl.DateTimeFormat('en-US', options).format(date);
    
        return { ...post, createdAt: newTimeString };
      });
    
      SetPosts(fPosts)
    }
     else {
      SetPosts([]);
    }
  }, [fetchedPosts]);
  const navigate = useNavigate();

  const CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  if (loading) return <ClipLoader size={150} style={{...CSSProperties}}/>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fadeInUp">
                  Welcome to My Blog
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 animate-fadeInUp animation-delay-200">
                  Exploring ideas, sharing insights, and documenting my journey through the world of technology and beyond.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-400">
                <Button className="w-full sm:w-auto">Latest Posts</Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/login')}>Join Community</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 animate-fadeInUp">
              Featured Posts
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.length === 0 ? (
                <div>No posts available.</div>
              ) : (
                posts.map((post, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start gap-4 animate-fadeInUp hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                    style={{ animationDelay: `${i * 200}ms` }}>
                    <img
                      alt="Blog post thumbnail"
                      className="aspect-[16/9] overflow-hidden rounded-lg object-cover w-full transition-transform duration-200 ease-in-out hover:scale-105"
                      height="180"
                      src={`/placeholder.svg?height=180&width=320`}
                      width="320" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{post.title}</h3>
                      {post.tags?.map((tag,index)=>(<p key={index} className="p-1 text-sm inline mr-1 w-fit bg-gray-500 rounded text-white">{tag}</p>))}
                      <p className="text-gray-500 dark:text-gray-400">{post.content}</p>
                      <p className="text-gray-500">{post.createdAt}</p>
                    </div>
                    <Button variant="link" className="p-0 transition-all duration-200 ease-in-out hover:translate-x-2">
                      Read More
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl animate-fadeInUp">
                  Join Our Community
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 animate-fadeInUp animation-delay-200">
                  Log in to your account or register to become a part of our growing community. Share your thoughts, engage with other readers, and get exclusive content.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 animate-fadeInUp animation-delay-400">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button className="w-full sm:w-auto" variant="outline" onClick={() => navigate('/login')}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </Button>
                  <Button className="w-full sm:w-auto" onClick={() => navigate('/register')}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 My Blog. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4 transition-all duration-200 ease-in-out hover:text-primary" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4 transition-all duration-200 ease-in-out hover:text-primary" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
