import styles from "/styles/Shared.module.css";

const deletePlan = async (licenseId) => {
    try {
      // const returnedLicenses = await api.licenses.getLicenses(userId);
      console.log(licenseId)
      console.log(process.env["SALABLE_API_KEY"])
      const res = await fetch("/api/salable/delete?licenseId="+licenseId, {
        method: "DELETE", 
        headers: {
          "x-api-key" : process.env["SALABLE_API_KEY"]
        }
      });
      const body = await res.json()
      window.location.reload(false);
    } catch (err) {
      console.error(err);
    }
  }
  
export const LicenseBlock = ({id, plan, status}) => (
      <div className={styles.cardContent}>
        <img alt="Sign up" src="/icons/download.svg" />
        <div>
          <h3>{plan}</h3>
          <p>Entitlement Number: {id}</p>
        </div>
        <div onClick={() => deletePlan(id)}>
            <img alt="Sign up" src="/icons/external-link.svg" />
            Cancel
        </div>
        
      </div>
  );