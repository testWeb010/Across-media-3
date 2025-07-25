import React, { useState, useEffect } from 'react';
import { ExternalLink, Play, ArrowUpRight, Sparkles, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRequestJson } from '@/utils/api';

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  status: string;
  createdAt: string;
}

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const gradients = [
    "from-cyan-500 to-pink-600",
    "from-pink-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-pink-500 to-red-600",
    "from-cyan-500 to-pink-600",
    "from-pink-500 to-purple-600"
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiRequestJson<{ projects: Project[] }>('/api/projects?limit=6&status=published');
        setProjects(response.projects || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects');
        setProjects([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 animate-pulse">
          <div className="w-full h-64 bg-gray-700"></div>
          <div className="p-8">
            <div className="h-6 bg-gray-700 rounded mb-3"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-20">
      {/* Moving card animation */}
      <div className="relative mb-12 overflow-hidden">
        <div className="flex animate-[slide-in-right_3s_ease-in-out_infinite] space-x-8">
          {[...Array(3)].map((_, index) => (
            <div
              key={`empty-card-${index}`}
              className="flex-shrink-0 w-80 h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-6 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-pink-600 rounded-full flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-4/5"></div>
                <div className="h-3 bg-gray-700 rounded w-3/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="work" className="py-32 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Our Work</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore our recent work and discover how we've helped brands achieve extraordinary 
            results through innovative media solutions and strategic partnerships.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div 
                  key={project._id} 
                  className="group relative cursor-pointer"
                  onClick={() => navigate(`/post/${project._id}?type=project`)}
                >
                  {/* Glowing border effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000`}></div>
                  
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-500">
                    <div className="relative overflow-hidden">
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                          <FolderOpen className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <div className="flex gap-3">
                            <button 
                              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/post/${project._id}?type=project`);
                              }}
                            >
                              <Play size={20} className="text-white" />
                            </button>
                            <button 
                              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/post/${project._id}?type=project`);
                              }}
                            >
                              <ExternalLink size={20} className="text-white" />
                            </button>
                          </div>
                          <ArrowUpRight className="w-6 h-6 text-white/80" />
                        </div>
                      </div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`bg-gradient-to-r ${gradients[index % gradients.length]} px-3 py-1 rounded-full`}>
                          <span className="text-white text-xs font-semibold">{project.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-pink-500 transition-all duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-pink-600 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <span>View All Projects</span>
                  <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
