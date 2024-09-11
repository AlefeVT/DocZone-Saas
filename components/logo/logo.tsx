import { AiOutlineDeploymentUnit } from 'react-icons/ai';

export function InitialLogo() {
  return (
    <a href="/dashboard" className="flex items-center gap-2">
      <AiOutlineDeploymentUnit className="stroke h-9 w-9 stroke-gray-300 stroke-[1.5] text-gray-200" />
      <p className="bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-2xl font-bold leading-tinght tracking-tighter text-transparent">
        E-commerce
      </p>
    </a>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <AiOutlineDeploymentUnit className="stroke h-9 w-9 stroke-gray-500 text-gray-500 dark:text-gray-300" />
      <h1 className="text-black font-bold text-xl lg:text-xl">
        Doc<span className="text-primary">Zone</span>
      </h1>
    </div>
  );
}
