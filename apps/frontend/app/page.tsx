
import { Pencil, Share2, Lock, Sparkles, ChevronRight, Github } from 'lucide-react';
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-purple-50 to-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Pencil className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">Excalidraw Clone</span>
          </div> 
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Blog</a>
            <a href="https://github.com" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Open App
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Collaborative Drawing Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create beautiful hand-drawn diagrams, flowcharts, and illustrations with our intuitive whiteboard tool. Perfect for teams, designers, and educators.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
              <span>Start Drawing</span>
              <ChevronRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-300 transition-colors">
              View Examples
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Pencil className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Intuitive Drawing</h3>
              <p className="text-gray-600">
                Create professional-looking diagrams with our easy-to-use drawing tools and shapes library.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Collaboration</h3>
              <p className="text-gray-600">
                Work together with your team in real-time, no matter where they are located.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">End-to-End Encryption</h3>
              <p className="text-gray-600">
                Your drawings are secure with our end-to-end encryption technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl font-bold mb-6">See it in action</h2>
              <p className="text-gray-600 mb-8">
                Watch how easy it is to create beautiful diagrams and collaborate with your team in real-time.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=600&q=80" 
                alt="Collaborative drawing demonstration"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                  <h3 className="text-2xl font-semibold">Key Features</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <ChevronRight className="h-6 w-6 text-purple-600 flex-shrink-0" />
                    <span>Infinite canvas with zoom capabilities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <ChevronRight className="h-6 w-6 text-purple-600 flex-shrink-0" />
                    <span>Export to PNG, SVG, and other formats</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <ChevronRight className="h-6 w-6 text-purple-600 flex-shrink-0" />
                    <span>Library of customizable shapes and elements</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <ChevronRight className="h-6 w-6 text-purple-600 flex-shrink-0" />
                    <span>Smart drawing recognition and alignment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Pencil className="h-6 w-6" />
              <span className="text-xl font-bold">Excalidraw Clone</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-purple-400">Terms</a>
              <a href="#" className="hover:text-purple-400">Privacy</a>
              <a href="#" className="hover:text-purple-400">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Excalidraw Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
