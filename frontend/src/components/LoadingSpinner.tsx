const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
        <div className="flex items-center space-x-2">
            <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-black"/>
        </div>
    </div>
);

export default LoadingSpinner;
