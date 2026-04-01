using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface ITherapyRepository
    {
        //Task<IEnumerable<Therapy>> GetTherapiesByDurationAsync(int durationMinutes);
        //Task<IEnumerable<Therapy>> GetTherapiesByCostRangeAsync(decimal min, decimal max);
        //Task<bool> TherapyNameExistsAsync(string name);

        IQueryable<Therapy> GetAllAsync();
        Task<Therapy?> GetByIdAsync(int id);
        Task<Therapy> CreateAsync(Therapy therapy);
        Task<Therapy> UpdateAsync(Therapy therapy);
        Task<bool> DeleteAsync(int id);
    }
}
