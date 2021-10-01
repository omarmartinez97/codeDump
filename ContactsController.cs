using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using TravelRecon.AppServices.Exceptions;
using TravelRecon.AppServices.Settings;
using TravelRecon.AppServices.Users;
using TravelRecon.AppServices.Users.ViewDtos;
using TravelRecon.Web.Code;

namespace TravelRecon.Web.Areas.Contacts
{
    public class ContactsController : BaseApiController
    {
        private readonly IContactsService _contactsService;
        private readonly IUserRelationshipService _userRelationshipService;

        public ContactsController(IContactsService contactsService, 
            IUserRelationshipService userRelationshipService,
			ISettingsService settingService, IUserService userService
		) : base(settingService, userService)
        {
            _contactsService = contactsService;
            _userRelationshipService = userRelationshipService;
        }

        [HttpPost]
        public HttpResponseMessage GetContacts()
        {
            var currentUser = GetCurrentUser();
            var results = _contactsService.GetContactsForCurrentUser(currentUser);
            return Request.CreateResponse(results);
        }

        [Route("api/contacts/me/invites")]
        [HttpGet]
        public Task<List<ContactRelationshipDto>> GetInvites()
        {
            var currentUser = GetCurrentUser();
            return _contactsService.GetInvitesAsync(currentUser.Id);
        }

        [Route("api/contacts/me")]
        [HttpGet]
        public Task<List<ContactRelationshipDto>> GetSelfContacts()
        {
            var currentUser = GetCurrentUser();
            return _contactsService.GetContactsAsync(currentUser.Id);
        }

        [HttpPost]
        public HttpResponseMessage GetAcceptedContacts()
        {
            var currentUser = GetCurrentUser();
            var results = _contactsService.GetAcceptedContactForCurrentUser(currentUser);
            return Request.CreateResponse(results);
        }

        [HttpPost]
        public HttpResponseMessage SearchContacts([FromBody] string searchCharacters)
        {
            var currentUser = GetCurrentUser();
            var results = _contactsService.GetContactSearchResultsViewModel(searchCharacters, currentUser);
            return Request.CreateResponse(results);
        }

        [Route("api/contacts/users-for-invite")]
        [HttpPost]
        public Task<List<ContactRelationshipDto>> UsersForInvite([FromBody] ContactSearchParams search)
        {
            return _userRelationshipService.GetUsersForInviteAsync(search.SearchTerms, search.Order, CurrentUserId);
        }
        [Route("api/contacts/users-for-same-organization")]
        [HttpPost]
        public Task<List<ContactRelationshipDto>> UsersForSameOrganization([FromBody] ContactSearchParams search)
        {
            return _userRelationshipService.GetUsersForSameOrganization(search.SearchTerms, search.Order, CurrentUserId);
        }

        [HttpPost]
        public Task<ContactDetailsViewModel> GetContactDetails([FromBody] int contactId)
        {
            var currentUser = GetCurrentUser();
            return _contactsService.GetContactDetails(contactId, currentUser, _passPhrase);
        }

        public class StatusChangeRequest
        {
            public int UserId { get; set; }
        }

        [HttpPost]
        public IHttpActionResult AcceptInvitation(StatusChangeRequest request)
        {
            var currentUser = GetCurrentUser();
            _contactsService.AcceptInvitation(currentUser, request.UserId);
            return Ok();
        }

        [HttpPost]
        public IHttpActionResult RejectContact(StatusChangeRequest request)
        {
            var currentUser = GetCurrentUser();
            _contactsService.RejectContactRelationship(currentUser, request.UserId);
            return Ok();
        }

		[HttpPost]
		public Task DeleteContact(StatusChangeRequest request)
		{
			var currentUser = GetCurrentUser();
			return _contactsService.DeleteContactRelationship(currentUser, request.UserId);
		}

		[HttpPost]
        public IHttpActionResult IgnoreContact(StatusChangeRequest request)
        {
            var currentUser = GetCurrentUser();
            _contactsService.IgnoreContactRelationship(currentUser, request.UserId);
            return Ok();
        }

        [Route("api/contacts/invite/{userId}")]
        [HttpPost]
        public Task InviteUser([FromUri] int userId)
        {
            return _contactsService.InviteAsync(userId, CurrentUserId);
        }
    }
}
