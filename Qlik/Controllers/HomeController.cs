using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Mvc;
using QlikAuthNet;

namespace Qlik.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Report()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpPost]
        public JsonResult CertResult(string keyword, string finding, string store, string location)
        {
            var storeName = (StoreName)Enum.Parse(typeof(StoreName), store);
            var storeLocation = (StoreLocation)Enum.Parse(typeof(StoreLocation), location);
            var findBy = (X509FindType)Enum.Parse(typeof(X509FindType), finding);

            var certStore = new X509Store(storeName, storeLocation);
            certStore.Open(OpenFlags.ReadOnly);

            var certCollection = certStore.Certificates.Find(findBy, keyword, false);

            if (certCollection.Count <= 0)
                return Json(new { Found = "No cert found" });
            var cert = certCollection[0];

            certStore.Close();
            return Json(new
            {
                Found = "Yes",
                cert.Archived,
                cert.Extensions.Count,
                cert.FriendlyName,
                cert.HasPrivateKey,
                IssuerName = cert.IssuerName.Name,
                cert.NotAfter,
                cert.NotBefore,
                cert.PublicKey.Key.SignatureAlgorithm,
                SubjectName = cert.SubjectName.Name,
                cert.Thumbprint,
                cert.Version

            });
        }

        [HttpPost]
        public JsonResult QlikResult(string userDirectory, string userId, string proxyRestUri, string keyword, string finding, string store, string location)
        {
            var storeName = (StoreName)Enum.Parse(typeof(StoreName), store);
            var storeLocation = (StoreLocation)Enum.Parse(typeof(StoreLocation), location);
            var findType = (X509FindType)Enum.Parse(typeof(X509FindType), finding);

            var req = new Ticket()
            {
                UserDirectory = "QLIK",
                UserId = "rfn"
            };

            req.TicketRequest();

            return Json(req);
        }
    }
}