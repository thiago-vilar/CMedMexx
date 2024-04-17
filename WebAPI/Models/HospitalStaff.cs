// Caminho: C:\Projetos\CMedMexx\WebAPI\Models\HospitalStaff.cs

using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class HospitalStaff : User
    {
        public string HospitalName { get; set; }
        public string CNPJ { get; set; }
        public string Name { get; set; }
        public string CPF { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }

        public HospitalStaff()
        {
            HospitalName = string.Empty;
            CNPJ = string.Empty;
            Name = string.Empty;
            CPF = string.Empty;
            PhoneNumber = string.Empty;
            Address = string.Empty;
        }
    }
}
